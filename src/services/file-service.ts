import { Injectable } from "@decorators/di";
import { UploadedFile } from "express-fileupload";

@Injectable()
export class FileService {

    /**
     * Validate file for content type
     * @param file
     * @param extension
     */
    public async validateFile(file: UploadedFile, extension: Array<string>): Promise<boolean> {
        if (!file) return false;
        if (extension.includes(file.mimetype)) return true;
        return false;
    }
}