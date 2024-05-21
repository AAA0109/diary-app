import { Comment } from 'core/domain/comments/comment';
import { SocialError } from 'core/domain/common/socialError';
import { Map, fromJS } from 'immutable';
import { injectable, inject } from 'inversify';
import type { IHttpService } from 'core/services/webAPI/IHttpService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { ICommunityService } from 'core/services/community/ICommunityService';
import { CommunityThread } from 'core/domain/community/thread';

/**
 * Firbase comment service
 */
@injectable()
export class CommunityService implements ICommunityService {
    @inject(SocialProviderTypes.HttpService) private _httpService: IHttpService;

    /**
     * Add comment
     */
    public getForumList = async (forumFilter: string[]) => {
        try {
            const result = await this._httpService.post('community/forums', {
                forumFilter
            });
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public getSubformData = async (id: string, sortBy: any) => {
        try {
            const result = await this._httpService.post(`community/subform/${id}`, sortBy);
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public searchThreads = async (searchKey: string) => {
        try {
            const result = await this._httpService.post(`community/thread/search/`, { searchKey });
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public getThreadData = async (id: string) => {
        try {
            const result = await this._httpService.get(`community/thread/${id}`);
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public postThread = async (thread: CommunityThread) => {
        try {
            const result = await this._httpService.post('community/thread/post', thread);
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public likeThread = async (thread_id: string) => {
        try {
            const result = await this._httpService.post(`community/thread/like/${thread_id}`);
            return { error: result.error };
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public addThreadComment = async (threadId: string, comment: string, parentId?: string) => {
        try {
            const params = {
                comment,
                parentId,
            }
            const result = await this._httpService.post(`community/thread/${threadId}/comment`, params);
            return { error: result.error };
        } catch (error: any) {
            console.log(error);
            throw new SocialError(error.code, error.message);
        }
    };

    public deleteThreadComment = async (commentId: string) => {
        try {
            const result = await this._httpService.delete(`community/thread/comment/${commentId}`);
            return { error: result.error };
        } catch (error: any) {
            console.log(error);
            throw new SocialError(error.code, error.message);
        }
    };

    public getFamilyDiaryList = async (params?: any) => {
        try {
            const result = await this._httpService.post(`diary/user/${params.userId}`, params);
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

}
