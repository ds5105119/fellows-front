import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ contract_id: string }> }) {
  const session = await auth();
  const body = await request.json();

  const contract_id = (await params).contract_id;
  const url = `${process.env.NEXT_PUBLIC_PROJECT_URL}/contract/${contract_id}`;

  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "unknown";
  console.log(clientIp);
  const bodyWithIp = { ...body, ip_address: clientIp };

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      body: JSON.stringify(bodyWithIp),
      redirect: "follow",
      credentials: "include",
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Failed to fetch project data" }, { status: 500 });
  }
}
