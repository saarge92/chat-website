import {Controller, Post, Request as RequestDecorator, Response as ResponseDecorator} from "@decorators/express";
import {Request, Response} from "express";
import {countUsersQueue} from "../jobs/count-of-users.job";
import {AdminMiddleware} from "../middleware/is-admin.middleware";
import {Inject} from "@decorators/di";
import {EmailService} from "../services/email-service";
import {transformAndValidate} from "class-transformer-validator";
import {EmailDto} from "../dto/email-dto";

/**
 * Controller for requesting jobs
 * for admin
 * @copyright Serdar Durdyev
 */
@Controller("/admin/job", [AdminMiddleware])
export class AdminJobController {
    constructor(@Inject(EmailService) private readonly emailService: EmailService) {
    }

    /**
     * Get amount counts of users in database
     * @param request Current http request
     * @param response Response for admin
     */
    @Post("/users")
    public async startUsersCountJob(request: Request, response: Response) {
        const job = await countUsersQueue.add();
        return response.json({job: job.id}).status(200)
    }

    /**
     * Send email message
     * @param request
     * @param response
     */
    @Post("/email")
    public async sendEmail(@RequestDecorator() request: Request, @ResponseDecorator() response: Response) {
        const emailDto = await transformAndValidate(EmailDto, request.body)
            .catch((result) => response.json(result).status(400)) as EmailDto;

        const jobData = await this.emailService.sendEmailMessage(emailDto);
        return response.json(jobData).status(200);
    }
}