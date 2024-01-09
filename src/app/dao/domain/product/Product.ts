export class Product {
    public _id?: string;
    public title: string;
    public description: string;
    public price: number;
    public thumbnail: string;
    public code: string;
    public stock: number;
    public category: string;
    public owner?: string;
    public status: boolean;

    constructor(title: string, description: string, price: number, thumbnail: string, code: string, stock: number, category: string, owner: string, status: boolean) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.category = category;
        this.owner = owner;
        this.status = status;
    }
}