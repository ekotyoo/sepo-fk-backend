import env from "../util/env";

export const MailConfig = {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    auth: {
        user: env.SMTP_EMAIL,
        pass: env.SMTP_PASS
    }
};