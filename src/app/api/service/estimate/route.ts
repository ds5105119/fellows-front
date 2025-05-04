import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://127.0.0.1:8000/api/fellows/estimate";

export async function GET(request: NextRequest) {
  try {
    // 클라이언트가 보낸 URL에서 쿼리스트링 추출
    const searchParams = request.nextUrl.searchParams;
    const urlWithParams = `${API_URL}?${searchParams.toString()}`;

    // FastAPI로 GET 요청 전송 (SSE)
    const apiResponse = await fetch(urlWithParams, {
      method: "GET",
      headers: {
        Accept: "text/event-stream",
      },
    });

    // 실패 응답 처리
    if (!apiResponse.ok) {
      return new NextResponse(JSON.stringify({ error: "견적 생성 중 오류가 발생했습니다." }), {
        status: apiResponse.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else if (apiResponse.body) {
      console.log("스트리밍 응답 전달");
      return new NextResponse(apiResponse.body, {
        headers: {
          "Content-Type": "text/event-stream",
          Connection: "keep-alive",
          "Cache-Control": "no-cache",
        },
      });
    } else {
      return new NextResponse(JSON.stringify({ error: "응답 데이터가 없습니다." }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    // 예외 발생 시 SSE 포맷으로 에러 반환
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "error",
              message: "견적 생성 중 오류가 발생했습니다. 다시 시도해 주세요.",
            })}\n\n`
          )
        );
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }
}
