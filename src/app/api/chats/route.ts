import { prisma } from "@/app/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json()
    const chatCreated = await prisma.chat.create({
        data: {
            messages: {
                create: {
                    content: body.content
                }
            },
        },
        select: {
            id: true,
            messages: true,
            created_at: true,
        },
    });

    return NextResponse.json({ chatCreated })
}

export async function GET(request: NextRequest) {
    const chats = await prisma.chat.findMany({
        select: {
            id: true,
            messages: {
                orderBy: { created_at: "desc", },
                take: 1,
            },
            created_at: true,
        },
        orderBy: {
            created_at: "desc",
        },
    });

    return NextResponse.json({ chats })
}