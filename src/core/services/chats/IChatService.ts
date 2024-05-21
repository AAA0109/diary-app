import { ChatChannel } from "core/domain/chats/chatChannel";
import { DBUser } from "core/domain/users/dbUser";

/**
 * Comment service interface
 *
 * @export
 * @interface IChatService
 */
export interface IChatService {
    getAllChatChannels: () => Promise<{ channels: []; }>;
    getChatChannel: (chatId: string, isGroup: string) => Promise<{ channel: ChatChannel; }>;
    createNewGroup: (name: string, members: DBUser[], image?: string) => Promise<{ error?: string; }>;
}
