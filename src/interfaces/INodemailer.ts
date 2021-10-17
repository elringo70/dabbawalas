export interface IEmailAddress {
    name: string,
    email: string
}

export interface IMessage {
    to: IEmailAddress,
    from: IEmailAddress,
    subject: string,
    body: string
}

export interface AddEmailAccount {
    sendEmail: (message: IMessage) => Promise<void>
}