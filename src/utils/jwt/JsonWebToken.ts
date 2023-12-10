export class JsonWebToken {
    sub: string;
    email: string;
    firstName: string;
    role: string;
    cart: string | null;

    constructor(sub: string, email: string, firstName: string, role: string, cart: string | null) {
        this.sub = sub;
        this.email = email;
        this.firstName = firstName;
        this.role = role;
        this.cart = cart;
    }
}