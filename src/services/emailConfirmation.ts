import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { IMessage, AddEmailAccount } from '../interfaces/INodemailer'

export default class Email implements AddEmailAccount{
    private readonly transporter: Mail

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: 'dabbawalas2021@gmail.com',
                pass: 'System01!'
            }
        })
    }

    async sendEmail(message: IMessage): Promise<void> {
        await this.transporter.sendMail({
            to: {
                name: message.to.name,
                address: message.to.email
            },
            from: {
                name: message.to.name,
                address: message.to.email
            },
            subject: message.subject,
            html: message.body
        })
    }
}