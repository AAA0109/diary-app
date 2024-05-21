import { Family } from "core/domain/family/family";

export interface UserModel {
    id?: string;
    fullName: string;
    email?: string;
    avatar?: string;
    banner?: string;
    socialName?: string;
    followCount?: number;
    followerCount?: number;
    tagLine?: string;
    twitterId?: string;
    instagramId?: string;
    linkedInId?: string;
    facebookId?: string;
    phoneNumber?: string;
    position?: string;
    country?: string;
    school?: string;
    address?: string;
    about?: string;
    role?: string;
    jobRole?: string;
    company?: string;
    isPublic: boolean;
    family?: Family;
    onboarding: boolean;
    guardianId?: number;
    birthdate?: Date;
    customName?: string;
    password?: string;
}
