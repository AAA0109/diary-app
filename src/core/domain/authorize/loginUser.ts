import { BaseDomain } from 'core/domain/common/baseDomain';

export class LoginUser extends BaseDomain {
    constructor(
        public id: number,
        public emailVerified: boolean,
        public fullName: string = '',
        public email: string = '',
        public avatar: string = '',
        public family: object = {},
        public guardianId?: number,
        public birthdate?: Date,
        public role?: { role: string; },
    ) {
        super();
    }
}
