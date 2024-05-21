import { BaseDomain } from 'core/domain/common/baseDomain';
import { UserSettingItem } from './userSettingItem';

export class UserRole extends BaseDomain {
    constructor(
        public id: number,
        public role: string,
    ) {
        super();
    }
}
