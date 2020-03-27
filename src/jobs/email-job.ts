import Queue from "bull";
import { redisSettings } from "../constants/redis-queue-settings";
import nodeMailer from "nodemailer";
import { emailConfig } from "../constants/emailConfig";
import { UploadedFile } from "express-fileupload";

// @ts-ignore
export const emailJob = new Queue("email-job", redisSettings);

/**
 * Job will proccess email sending messaging via redis cluster
 */
emailJob.process(async (job, done) => {
    const emailData = job.data;
    const file: UploadedFile = emailData.file;
    await nodeMailer.createTransport(emailConfig).sendMail({
        from: process.env.USER_EMAIL,
        subject: emailData.subject ? emailData.subject : "",
        to: emailData.email,
        text: emailData.body,
        attachments: [
            {
                filename: file.name,
                content: Buffer.from(file.data)
            }
        ]
    }).catch((error) => {
        console.log(error)
        done(error, {});
    })
    done(null);
})