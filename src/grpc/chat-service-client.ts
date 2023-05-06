import { Metadata } from "@grpc/grpc-js";
import { client } from "./client";
import { ChatServiceClient as ChatClient } from "./rpc/pb/ChatService"
import { metadata } from "@/app/layout";

export default class ChatServiceClient {
    constructor(private readonly client: ChatClient, private readonly metadata: Metadata) { }

    chatStream(data: { chat_id: string | null, user_id: string, content: string }) {
        const stream = this.client.chatStream(
            {
                chatId: data.chat_id!,
                userId: data.user_id,
                userMessage: data.content
            },
            this.metadata
        );

        return stream;
    }
}

export class ChatServiceClientFactory {
    static create(): ChatServiceClient {
        const meta = new Metadata();
        meta.add("authorization", process.env.GRPC_TOKEN as string);

        return new ChatServiceClient(client, meta);
    }
}