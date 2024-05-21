import { Comment } from 'core/domain/comments/comment';
import { SocialError } from 'core/domain/common/socialError';
import { Map, fromJS } from 'immutable';
import { injectable, inject } from 'inversify';
import type { IHttpService } from 'core/services/webAPI/IHttpService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { throwNoValue } from 'utils/errorHandling';
import { DiaryTopic } from 'core/domain/diary/diaryTopic';
import { Diary } from 'core/domain/diary/diary';
import { IChatService } from 'core/services/chats/IChatService';
import { DBUser } from 'core/domain/users/dbUser';

/**
 * Firbase comment service
 */
@injectable()
export class ChatService implements IChatService {
    @inject(SocialProviderTypes.HttpService) private _httpService: IHttpService;

    public getAllChatChannels = async () => {
        try {
            const result = await this._httpService.get('chats/channels');
            return { channels: result.channels ?? [] };
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public getChatChannel = async (chatId: string, isGroup: string) => {
        try {
            const result = await this._httpService.get(`chats/${isGroup}/${chatId}`);
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };
    
    public createNewGroup = async (name: string, members: DBUser[], image?: string) => {
        try {
            const result = await this._httpService.post(`chats/channel/create`, {
                name,
                members,
                image,
            });
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };
}
