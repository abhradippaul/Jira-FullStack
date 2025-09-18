import dotenv from "dotenv";
dotenv.config();

import { Resend } from "resend";
import { welcomeEmail } from "../../mail-template/weclome-mail.js";
const resend = new Resend(process.env.RESEND_API_KEY);

export function sendMail(sendTo: string, subject: string, name: string) {
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: [sendTo],
    subject: subject,
    html: welcomeEmail(name),
  });
}
