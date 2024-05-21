import { injectable, inject } from 'inversify';
import type { IHttpService } from 'core/services/webAPI/IHttpService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { ICommonService } from 'core/services/common/ICommonService';
/**
 * Firbase comment service
 */
@injectable()
export class CommonService implements ICommonService {
    @inject(SocialProviderTypes.HttpService) private _httpService: IHttpService;

    /**
     * Get twitter media
     */
    getTwitterMedia = async () => {
        return 'Not implementd!' as any;
    };

    /**
     * Post feedback
     */
    addFeed = async () => {
        return 'Not implementd!' as any;
    };

    fileUpload = async (file: any) => {
        const formData = new FormData();
        formData.append("file", file);
        return await this._httpService.post('file/upload', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "x-rapidapi-host": "file-upload8.p.rapidapi.com",
                "x-rapidapi-key": "your-rapidapi-key-here",
            },
        }) as any;
    }
}
