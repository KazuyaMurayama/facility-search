"use client";

import { Message } from "@/types";
import { ResultCard } from "./result-card";
import { SuggestionChips } from "./suggestion-chips";
import { WebResultList } from "./web-result-card";

interface MessageBubbleProps {
  message: Message;
  onSuggestionClick?: (suggestion: string) => void;
}

export function MessageBubble({ message, onSuggestionClick }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[85%] ${
          isUser
            ? "bg-blue-600 text-white rounded-2xl rounded-br-md px-4 py-3"
            : "bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm"
        }`}
      >
        {!isUser && (
          <div className="text-xs text-gray-400 mb-1 font-medium">
            🔍 ファシリティサーチ
          </div>
        )}

        <div
          className={`whitespace-pre-wrap text-sm leading-relaxed ${
            isUser ? "text-white" : "text-gray-800"
          }`}
        >
          <MarkdownContent content={message.content} />
        </div>

        {message.results && message.results.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.results.map((result) => (
              <ResultCard key={result.placeId} result={result} />
            ))}
          </div>
        )}

        {message.webResults && message.webResults.length > 0 && (
          <WebResultList results={message.webResults} />
        )}

        {message.suggestions && message.suggestions.length > 0 && onSuggestionClick && (
          <div className="mt-3">
            <SuggestionChips
              suggestions={message.suggestions}
              onSelect={onSuggestionClick}
            />
          </div>
        )}

        <div
          className={`text-xs mt-2 ${
            isUser ? "text-blue-200" : "text-gray-400"
          }`}
        >
          {message.timestamp.toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}

function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");

  // Parse code blocks first
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let elementIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        // End code block
        elements.push(
          <pre key={`code-${elementIndex++}`} className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 my-2 text-xs font-mono overflow-x-auto">
            <code>{codeLines.join("\n")}</code>
          </pre>
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }
    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }
    // Regular line processing
    elements.push(<MarkdownLine key={`line-${i}`} line={line} />);
  }

  // Unclosed code block
  if (inCodeBlock && codeLines.length > 0) {
    elements.push(
      <pre key={`code-${elementIndex++}`} className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 my-2 text-xs font-mono overflow-x-auto">
        <code>{codeLines.join("\n")}</code>
      </pre>
    );
  }

  return <>{elements}</>;
}

function MarkdownLine({ line }: { line: string }) {
  if (line.startsWith("### ")) {
    return (
      <h3 className="font-bold text-base mt-3 mb-1">
        {processInlineMarkdown(line.slice(4))}
      </h3>
    );
  }
  if (line.startsWith("## ")) {
    return (
      <h2 className="font-bold text-lg mt-3 mb-1">
        {processInlineMarkdown(line.slice(3))}
      </h2>
    );
  }
  if (line.startsWith("- ")) {
    return (
      <div className="ml-3 flex">
        <span className="mr-2">•</span>
        <span>{processInlineMarkdown(line.slice(2))}</span>
      </div>
    );
  }
  if (line.startsWith("---")) {
    return <hr className="my-2 border-gray-200" />;
  }
  if (line.trim() === "") {
    return <div className="h-2" />;
  }
  return (
    <div>
      {processInlineMarkdown(line)}
    </div>
  );
}

function processInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIndex = 0;

  while (remaining.length > 0) {
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
    const codeMatch = remaining.match(/`([^`]+)`/);

    type MatchInfo = { index: number; length: number; node: React.ReactNode };
    const candidates: MatchInfo[] = [];

    if (linkMatch && linkMatch.index !== undefined) {
      const href = linkMatch[2];
      const isSafeHref = /^(https?|vscode|cursor):\/\//.test(href);
      candidates.push({
        index: linkMatch.index,
        length: linkMatch[0].length,
        node: isSafeHref ? (
          <a
            key={`link-${keyIndex++}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            {linkMatch[1]}
          </a>
        ) : (
          <span key={`link-${keyIndex++}`} className="text-blue-600">
            {linkMatch[1]}
          </span>
        ),
      });
    }

    if (boldMatch && boldMatch.index !== undefined) {
      candidates.push({
        index: boldMatch.index,
        length: boldMatch[0].length,
        node: (
          <strong key={`bold-${keyIndex++}`} className="font-semibold">
            {boldMatch[1]}
          </strong>
        ),
      });
    }

    if (codeMatch && codeMatch.index !== undefined) {
      candidates.push({
        index: codeMatch.index,
        length: codeMatch[0].length,
        node: (
          <code key={`code-${keyIndex++}`} className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">
            {codeMatch[1]}
          </code>
        ),
      });
    }

    candidates.sort((a, b) => a.index - b.index);
    const firstMatch = candidates[0] ?? null;

    if (firstMatch) {
      if (firstMatch.index > 0) {
        parts.push(remaining.slice(0, firstMatch.index));
      }
      parts.push(firstMatch.node);
      remaining = remaining.slice(firstMatch.index + firstMatch.length);
    } else {
      parts.push(remaining);
      break;
    }
  }

  return <>{parts}</>;
}
