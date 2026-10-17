import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');
const fromEmail = process.env.EMAIL_FROM || 'no-reply@mwdsite.com';

export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY is not set. Mocking email send to:', to);
        return { id: 'mock_id', success: true };
    }

    try {
        const data = await resend.emails.send({
            from: fromEmail,
            to,
            subject,
            html,
        });
        return { ...data, success: true };
    } catch (error) {
        console.error('Failed to send email', error);
        return { success: false, error };
    }
}
