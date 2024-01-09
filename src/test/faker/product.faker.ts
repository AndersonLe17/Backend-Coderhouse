import { Product } from "../../app/dao/domain/product/Product";
import { faker } from '@faker-js/faker';

export class ProductFaker extends Product{
    constructor() {
        super(
            faker.commerce.productName(),
            faker.commerce.productDescription(),
            Number(faker.commerce.price()),
            faker.image.imageUrl(),
            faker.random.alphaNumeric(6),
            faker.number.int({min: 1, max: 100}),
            faker.commerce.department(),
            faker.database.mongodbObjectId(),
            faker.datatype.boolean()
        );
        this._id = faker.database.mongodbObjectId();
    }
}