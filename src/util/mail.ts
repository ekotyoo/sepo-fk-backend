import nodemailer from "nodemailer";
import { MailConfig } from "../config/mail.config";

const transporter = nodemailer.createTransport(MailConfig);

export const sendOTPMail = async (toMail: string, toName: string, otp: string) => {
    try {
        const info = await transporter.sendMail({
            from: MailConfig.auth.user,
            to: toMail,
            subject: 'Verifikasi Email Akun School Watch',
            html: `
            <div
                class="container"
                style="max-width: 90%; margin: auto; padding-top: 20px"
            >
                <h2>Hi, ${toName}.</h2>
                <p style="margin-bottom: 30px;">Silahkan masukkan kode OTP berikut pada aplikasi untuk memverifikasi email anda</p>
                <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${otp}</h1>
            </div>
            `
        });

        return info;
    } catch (err) {
        return false;
    }
};