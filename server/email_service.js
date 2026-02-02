const nodemailer = require('nodemailer');

/**
 * Smart Email Service
 * Implements "Waterfall" logic: Try Provider A -> If Fail -> Try Provider B
 */
class EmailService {
    constructor() {
        this.transporters = [];
        this.initProviders();
    }

    initProviders() {
        // 1. Brevo (Free: 300/day) - Primary
        if (process.env.BREVO_USER && process.env.BREVO_PASS) {
            this.transporters.push({
                name: 'Brevo',
                transport: nodemailer.createTransport({
                    host: 'smtp-relay.brevo.com',
                    port: 587,
                    auth: {
                        user: process.env.BREVO_USER,
                        pass: process.env.BREVO_PASS
                    }
                })
            });
        }

        // 2. SendGrid (Free: 100/day) - Secondary
        if (process.env.SENDGRID_USER && process.env.SENDGRID_PASS) {
            this.transporters.push({
                name: 'SendGrid',
                transport: nodemailer.createTransport({
                    host: 'smtp.sendgrid.net',
                    port: 587,
                    auth: {
                        user: process.env.SENDGRID_USER,
                        pass: process.env.SENDGRID_PASS
                    }
                })
            });
        }

        // 3. Gmail (Backup)
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            this.transporters.push({
                name: 'Gmail',
                transport: nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                })
            });
        }
    }

    async sendEmail(to, subject, html) {
        if (this.transporters.length === 0) {
            console.warn('[EmailService] No email providers configured.');
            return false;
        }

        // Waterfall Logic: Try each provider until one works
        for (const provider of this.transporters) {
            try {
                console.log(`[EmailService] Attempting to send via ${provider.name}...`);
                await provider.transport.sendMail({
                    from: `"Jai Gurudev Ashram" <${process.env.EMAIL_USER || 'no-reply@jaigurudev.com'}>`,
                    to: to,
                    subject: subject,
                    html: html
                });
                console.log(`[EmailService] Success via ${provider.name}!`);
                return true; // Stop after success
            } catch (error) {
                console.error(`[EmailService] Failed via ${provider.name}:`, error.message);
                // Continue to next provider...
            }
        }

        console.error('[EmailService] All providers failed.');
        return false;
    }
}

const emailService = new EmailService();
module.exports = emailService;
