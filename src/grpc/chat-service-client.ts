import { ChatServiceClient as ChatClient } from "./rpc/pb/ChatService"

export default class ChatServiceClient {
    constructor(private readonly client: ChatClient) { }

    chatStream(data: { chat_id?: string, user_id: string, content: string }) {

    }
}