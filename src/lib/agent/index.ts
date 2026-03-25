import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "./system-prompt";
import { toolDefinitions, executeTool } from "./tools";
import { SearchResult, WebSearchResult, ChatResponse } from "@/types";

const MAX_TOOL_ITERATIONS = 8;

let cachedClient: Anthropic | null = null;

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }
  if (!cachedClient) {
    cachedClient = new Anthropic({ apiKey });
  }
  return cachedClient;
}

export async function runAgent(
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<ChatResponse> {
  let client: Anthropic;
  try {
    client = getClient();
  } catch {
    return {
      message:
        "⚠️ ANTHROPIC_API_KEYが設定されていません。\n\n[.env.local を開いてAPIキーを設定する](vscode://file/.env.local)\n\n設定例:\n```\nANTHROPIC_API_KEY=sk-ant-xxxxx\nGOOGLE_MAPS_API_KEY=AIzaxxxxx\n```",
    };
  }

  const anthropicMessages: Anthropic.MessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const allResults: SearchResult[] = [];
  let allWebResults: WebSearchResult[] = [];
  let allSuggestions: string[] = [];
  const seenPlaceIds = new Set<string>();

  function addResults(results: SearchResult[]) {
    for (const r of results) {
      if (!seenPlaceIds.has(r.placeId)) {
        seenPlaceIds.add(r.placeId);
        allResults.push(r);
      }
    }
  }

  for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      tools: toolDefinitions,
      messages: anthropicMessages,
    });

    if (response.stop_reason === "end_turn") {
      const textContent = response.content
        .filter((block): block is Anthropic.TextBlock => block.type === "text")
        .map((block) => block.text)
        .join("\n");

      return {
        message: textContent,
        results: allResults.length > 0 ? allResults : undefined,
        webResults: allWebResults.length > 0 ? allWebResults : undefined,
        suggestions: allSuggestions.length > 0 ? allSuggestions : undefined,
      };
    }

    if (response.stop_reason === "tool_use") {
      const assistantContent = response.content;
      anthropicMessages.push({ role: "assistant", content: assistantContent });

      const toolUseBlocks = assistantContent.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
      );

      // Check for ask_user first
      const askUserBlock = toolUseBlocks.find((b) => b.name === "ask_user");

      // Execute all non-ask_user tools in parallel
      const otherBlocks = toolUseBlocks.filter((b) => b.name !== "ask_user");
      const parallelResults = await Promise.all(
        otherBlocks.map(async (block) => ({
          block,
          result: await executeTool(
            block.name,
            block.input as Record<string, unknown>
          ),
        }))
      );

      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const { block, result } of parallelResults) {
        if (result.results) addResults(result.results);
        if (result.webResults) {
          allWebResults = [...allWebResults, ...result.webResults];
        }

        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: result.content,
        });
      }

      // Handle ask_user after other tools
      if (askUserBlock) {
        const askResult = executeTool(
          "ask_user",
          askUserBlock.input as Record<string, unknown>
        );
        const resolved = await askResult;

        if (resolved.suggestions) {
          allSuggestions = [...allSuggestions, ...resolved.suggestions];
        }

        // Include results from parallel tools in the response
        toolResults.push({
          type: "tool_result",
          tool_use_id: askUserBlock.id,
          content:
            "ユーザーに質問を表示しました。ユーザーの回答を待っています。この質問をそのまま最終回答としてユーザーに提示してください。",
        });

        anthropicMessages.push({ role: "user", content: toolResults });

        const textParts = assistantContent
          .filter((b): b is Anthropic.TextBlock => b.type === "text")
          .map((b) => b.text);

        const fullMessage = [...textParts, resolved.content]
          .filter(Boolean)
          .join("\n\n");

        return {
          message: fullMessage,
          results: allResults.length > 0 ? allResults : undefined,
          webResults: allWebResults.length > 0 ? allWebResults : undefined,
          suggestions: resolved.suggestions,
        };
      }

      anthropicMessages.push({ role: "user", content: toolResults });
    }
  }

  return {
    message:
      "検索処理が複雑になりすぎました。条件を簡略化して再度お試しください。",
    results: allResults.length > 0 ? allResults : undefined,
    webResults: allWebResults.length > 0 ? allWebResults : undefined,
  };
}
