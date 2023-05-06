import { prisma } from "@/app/prisma/prisma";
import { ChatServiceClientFactory } from "@/grpc/chat-service-client";
import { ChatResponse } from "@/grpc/rpc/pb/ChatResponse";
import { writeOnStream } from "@/utils/stream/writer";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { messageId: string } }) {
    const { messageId } = params;

    const message = await prisma.message.findUniqueOrThrow({
        where: {
            id: messageId
        },
        include: {
            Chat: true
        }
    })

    const transformStream = new TransformStream();
    const writer = transformStream.writable.getWriter();

    if (message.has_ansered) {
        setTimeout(() => {
            writeOnStream(writer, "error", "Message already answered")
            writer.close();
        }, 100);

        return response(transformStream, 403)
    }

    if (message.is_from_bot) {
        setTimeout(() => {
            writeOnStream(writer, "error", "Message is from bot")
            writer.close();
        }, 100);

        return response(transformStream, 403)
    }

    const chatServiceClient = ChatServiceClientFactory.create();

    let messageReceived: ChatResponse | null = null;

    chatServiceClient.chatStream({
        chat_id: message.Chat.remote_chat_id,
        user_id: '1',
        content: message.content,
    })
        .on('data', (data) => {
            messageReceived = data;
            writeOnStream(writer, "message", data)
        })
        .on('error', async (error) => {
            writeOnStream(writer, "error", error)
            await writer.close();
        })
        .on('end', async () => {
            if (!messageReceived) writeOnStream(writer, "error", "No message received")

            const [newMessage] = await prisma.$transaction([
                prisma.message.create({
                    data: {
                        content: messageReceived!.content!,
                        chat_id: message.chat_id,
                        has_ansered: true,
                        is_from_bot: true,
                    }
                }),

                prisma.chat.update({
                    where: {
                        id: message.chat_id
                    },
                    data: {
                        remote_chat_id: messageReceived!.chatId!
                    }
                }),

                prisma.message.update({
                    where: {
                        id: message.id
                    },
                    data: {
                        has_ansered: true
                    }
                }),
            ])

            writeOnStream(writer, "end", newMessage)
            await writer.close();
        });

    return response(transformStream)
}

function response(transformStream: TransformStream, status: number = 200) {
    return new Response(transformStream.readable, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
        },
        status
    });
}