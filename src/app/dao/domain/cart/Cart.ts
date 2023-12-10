export class Cart {
    private _id?: string;
    public products: CartProduct[];

    constructor(products: CartProduct[]) {
        this.products = products;
    }
}

export class CartProduct {
    public product: string; 
    public quantity: number;

    constructor(product: string, quantity: number) {
        this.product = product;
        this.quantity = quantity;
    }
}