import { Feed } from 'core/domain/common/feed';
import { Map } from 'immutable';

/**
 * Common service interface
 */
export interface ICommonService {
    /**
     * Get twitter media
     */
    getTwitterMedia: (accessToken: string) => Promise<Map<string, any>>;

    /**
     * Post feedback
     */
    addFeed: (feed: Feed) => Promise<string>;

    /**
     * Upload file
     * @param {File} file
     * @returns {string} image url
     * @memberof ICommonService
    */
       fileUpload: (file: any) => Promise<any>;     
}
