import {Injectable} from "@decorators/di";
import {EmailDto} from "../dto/email-dto";
import {emailJob} from "../jobs/email-job";

/**
 * Service for sending email in background
 * @copyright Serdar Durdyev
 */
@Injectable()
export class EmailService {
    public async sendEmailMessage(emailDto: EmailDto): Promise<any> {
        const job = await emailJob.add(emailDto);
        return {
            id: job.id,
            name: job.name
        };
    }
}