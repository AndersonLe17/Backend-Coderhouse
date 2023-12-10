export class Message {
    _id?: string;
    user?: string;
    message: string;

    constructor(user: string, message: string) {
        this.user = user;
        this.message = message;
    }
}