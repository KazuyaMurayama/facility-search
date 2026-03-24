import { NextRequest, NextResponse } from "next/server";
import { runAgent } from "@/lib/agent";
import { ChatRequest } from "@/types";

const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES = 50;

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();

    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "messages配列が必要です" },
        { status: 400 }
      );
    }

    const validMessages = body.messages
      .filter(
        (m) =>
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0
      )
      .map((m) => ({
        role: m.role,
        content: m.content.slice(0, MAX_MESSAGE_LENGTH),
      }))
      .slice(-MAX_MESSAGES);

    if (validMessages.length === 0) {
      return NextResponse.json(
        { error: "有効なメッセージがありません" },
        { status: 400 }
      );
    }

    const response = await runAgent(validMessages);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        message:
          "申し訳ありません。エラーが発生しました。しばらくしてから再度お試しください。",
        ...(process.env.NODE_ENV === "development" && {
          error: error instanceof Error ? error.message : "Unknown error",
        }),
      },
      { status: 500 }
    );
  }
}
