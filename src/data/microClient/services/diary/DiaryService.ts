import { Comment } from 'core/domain/comments/comment';
import { SocialError } from 'core/domain/common/socialError';
import { Map, fromJS } from 'immutable';
import { injectable, inject } from 'inversify';
import type { IHttpService } from 'core/services/webAPI/IHttpService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { throwNoValue } from 'utils/errorHandling';
import { IDiaryService } from 'core/services/diary/IDiaryService';
import { DiaryTopic } from 'core/domain/diary/diaryTopic';
import { Diary } from 'core/domain/diary/diary';

/**
 * Firbase comment service
 */
@injectable()
export class DiaryService implements IDiaryService {
    @inject(SocialProviderTypes.HttpService) private _httpService: IHttpService;

    /**
     * Add comment
     */
    public getDiaryTopics = async () => {
        try {
            const result = await this._httpService.get('diary/topics');
            return { diaryTopics: result.topics };
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public getDiaryList = async (params?: any) => {
        try {
            const result = await this._httpService.post(`diary/all`, params);
            return { diaryList: result.diaryList };
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public getDiaryData = async (id: string) => {
        try {
            const result = await this._httpService.get(`diary/${id}`);
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public postDiary = async (diary: any) => {
        try {
            const result = await this._httpService.post('diary/post', diary);
            return { error: result.error };
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public editDiary = async (diary: any) => {
        try {
            const result = await this._httpService.post('diary/edit', diary);
            return { error: result.error };
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public likeDiary = async (diary_id: string) => {
        try {
            const result = await this._httpService.post(`diary/like/${diary_id}`);
            return { error: result.error };
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public deleteDiary = async (diary_id: string) => {
        try {
            const result = await this._httpService.delete(`diary/delete/${diary_id}`);
            return { error: result.error };
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public addDiaryComment = async (diaryId: string, comment: string, parentId?: string) => {
        try {
            const params = {
                comment,
                parentId,
            }
            const result = await this._httpService.post(`diary/${diaryId}/comment`, params);
            return { error: result.error };
        } catch (error: any) {
            console.log(error);
            throw new SocialError(error.code, error.message);
        }
    };

    public deleteDiaryComment = async (commentId: string) => {
        try {
            const result = await this._httpService.delete(`diary/comment/${commentId}`);
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

    public getNotificationList = async () => {
        try {
            const result = await this._httpService.get(`notifications`);
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

}
