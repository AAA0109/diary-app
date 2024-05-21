export class UserClaim {
    constructor() {
        this.isAnonymous = false;
        this.metadata = null;
        this.phoneNumber = null;
        this.providerData = 'telar';
        this.refreshToken = null;
        this.family = null;
    }

    public fullName: string;

    public email: string;

    public emailVerified: boolean;

    public isAnonymous?: boolean;

    public metadata?: any | null;

    public phoneNumber?: string | null;

    public avatar: string;

    public providerData?: any | null;

    public providerId: any;

    public refreshToken?: string | null;

    public uid: string;

    public phoneVerified: boolean;

    public family?: object | null;

    public guardianId?: number;

    public birthdate?: Date;

    public role?: string;

}
