import { prisma } from "@/app/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest, { params }: { params: { chatId: string } }) {
    const { chatId } = params;
    const messages = await prisma.message.findMany({
        where: {
            chat_id: chatId,
        },
        orderBy: {
            created_at: "asc",
        },
    });

    return NextResponse.json({ messages })
}

export async function POST(request: NextRequest, { params }: { params: { chatId: string } }) {
    const { chatId } = params;
    const body = await request.json()

    // verify if chat exist
    await prisma.chat.findUniqueOrThrow({
        where: {
            id: chatId,
        },
    });

    const messageCreated = await prisma.message.create({
        data: {
            chat_id: chatId,
            content: body.content
        },
        select: {
            id: true,
            chat_id: true,
            content: true,
            created_at: true,
        },
    });

    return NextResponse.json({ messageCreated })
}