import { BaseDomain } from 'core/domain/common/baseDomain';
import { UserPermissionType } from 'core/domain/common/userPermissionType';
import { UserRole } from './userRole';

export class DBUser extends BaseDomain {
    constructor(
        public id?: number | null,
        public firstName?: string,
        public lastName?: string,
        public fullName?: string,
        public avatar?: string,
        public email?: string,
        public emailVerified?: boolean,
        public currentEmotion?: string,
        public customName?: string,
        public guardianId?: number,
    ) {
        super();
    }
}
