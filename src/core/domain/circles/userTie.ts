import { BaseDomain } from 'core/domain/common/baseDomain';
import { Family } from '../family/family';

export class UserTie extends BaseDomain {
    constructor(
        /**
         * User identifier
         */
        public userId?: string,

        /**
         * Circle creation date time
         */
        public creationDate?: number,

        /**
         * User full name
         */
        public fullName?: string,

        /**
         * Avatar URL address
         */
        public avatar?: string,

        /**
         * If following user approved {true} or not {false}
         */
        public approved?: boolean,

        /**
         * List of circles identifire which this user belong to
         */
        public circleIdList?: string[],

        public family?: Family,

        public guardianId?: number,

    ) {
        super();
    }
}
