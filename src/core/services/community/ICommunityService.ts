import { CommunityForum } from 'core/domain/community/forum';
import { CommunitySubforum } from 'core/domain/community/subforum';
import { CommunityThread } from 'core/domain/community/thread';
import { Diary } from 'core/domain/diary/diary';
import { Map } from 'immutable';

/**
 * Comment service interface
 *
 * @export
 * @interface ICommunityService
 */
export interface ICommunityService {
    getForumList: (forumFilter: string[]) => Promise<{ forumList: CommunityForum[]; }>;
    getSubformData: (subform_id: string, sort: any) => Promise<{ subform: CommunitySubforum; }>;
    searchThreads: (searchKey: any) => Promise<{ threads: CommunityThread[]; }>;
    getThreadData: (threadId: string) => Promise<{ thread: CommunityThread }>;
    postThread: (thread: CommunityThread) => Promise<{ error?: string, thread: CommunityThread }>;
    likeThread: (thread_id: string) => Promise<{ error?: string }>;
    addThreadComment: (threadId: string, comment: string, parentId?: string) => Promise<{ error?: string }>;
    deleteThreadComment: (commentId: string) => Promise<{ error?: string }>;
}
