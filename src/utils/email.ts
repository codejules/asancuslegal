import { createTransport, type Transporter } from "nodemailer";

type SendEmailOptions = {
    name: string;
    to: string;
    subject: string;
    html: string;
};

export async function sendEmail(options: SendEmailOptions): Promise<Transporter> {
    const transporter = await getEmailTransporter();
    return new Promise(async (resolve, reject) => {
        // Build the email message
        const { name, subject, html } = options;
        const from = 'Asancus Legal Contacto ' + import.meta.env.SEND_EMAIL_FROM;
        const message = {
            name: name,
            to: "jserravidal@gmail.com",
            subject,
            html,
            from,
        };
        // Send the email
        transporter.sendMail(message, (err, info) => {
            // Log the error if one occurred
            if (err) {
                console.error(err);
                reject(err);
            }
            // Log the message ID and preview URL if available.
            resolve(info);
        });
    });
}

async function getEmailTransporter(): Promise<Transporter> {
    return new Promise((resolve, reject) => {
        if (!import.meta.env.RESEND_API_KEY) {
            throw new Error("Missing Resend configuration");
        }
        const transporter = createTransport({
            host: "smtp.resend.com",
            secure: true,
            port: 465,
            auth: { user: "resend", pass: import.meta.env.RESEND_API_KEY },
        });
        resolve(transporter);
    });
}