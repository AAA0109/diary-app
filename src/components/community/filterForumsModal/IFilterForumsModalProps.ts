import { CommunityForum } from "core/domain/community/forum";

export interface IFilterForumsModalProps {
    /**
     * Image file name
     */
    /**
     * Image style sheet
     */
    style?: {};

    /**
     * Handle click event
     */
    handleClose: () => void;

    open: boolean,

    topicFilter: string[],
    applyFilter: (topicFilter: string[]) => void,

    forums: CommunityForum[],
}
