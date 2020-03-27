import { Injectable } from "@decorators/di";
import { EmailDto } from "../dto/email-dto";
import { emailJob } from "../jobs/email-job";
import { UploadedFile } from "express-fileupload";

/**
 * Service for sending email in background
 * @copyright Serdar Durdyev
 */
@Injectable()
export class EmailService {

    /**
     * Send email message by admin to user
     * @param emailDto Body of data with email sending
     */
    public async sendEmailMessage(emailDto: EmailDto, file: UploadedFile): Promise<any> {
        const job = await emailJob.add({...emailDto, file});
        return {
            id: job.id,
            name: job.queue.name
        };
    }
}