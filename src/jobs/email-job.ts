import Queue from "bull";
import {redisSettings} from "../constants/redis-queue-settings";
import {EmailDto} from "../dto/email-dto";
import nodeMailer from "nodemailer";
import {emailConfig} from "../constants/emailConfig";

// @ts-ignore
export const emailJob = new Queue("email-job", redisSettings);

emailJob.process(async (job, done) => {
    const emailData: EmailDto = job.data;
    await nodeMailer.createTransport(emailConfig).sendMail({
        from: process.env.USER_EMAIL,
        subject: emailData.subject ? emailData.subject : "",
        to: emailData.email,
        text: emailData.body
    })
    done(null);
})