import { Diary } from 'core/domain/diary/diary';
import { Notification } from 'core/domain/notifications/notification';
import { Map } from 'immutable';

/**
 * Comment service interface
 *
 * @export
 * @interface IDiaryService
 */
export interface IDiaryService {
    getDiaryTopics: () => Promise<{ diaryTopics: Map<string, any>[]; }>;
    getDiaryList: (params?: any) => Promise<{ diaryList: Map<string, any>[]; }>;
    getDiaryData: (diary_id: string) => Promise<{ diary: Map<string, any>; }>;
    postDiary: (diary: any) => Promise<{ error?: string }>;
    editDiary: (diary: any) => Promise<{ error?: string }>;
    likeDiary: (diary_id: string) => Promise<{ error?: string }>;
    deleteDiary: (diary_id: string) => Promise<{ error?: string }>;
    addDiaryComment: (diaryId: string, comment: string, parentId?: string) => Promise<{ error?: string }>;
    getFamilyDiaryList: (params?: any) => Promise<{ diaryList: Diary[]; error?: string; }>;
    deleteDiaryComment: (commentId: string) => Promise<{ error?: string }>;
    getNotificationList: () => Promise<{ notificationList: Notification[]; error?: string; }>;
}
