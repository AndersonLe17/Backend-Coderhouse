import supertest from "supertest";

const request = supertest("http://localhost:8080");

describe("Carts Endpoints", () => {
  let token: string;
  const cid = "65ade253107bd2de64d75590";
  beforeAll(async () => {
    const res = await request.post("/api/sessions/login")
    .send({
      email: "john.doe@mail.com",
      password: "12345678",
    });

    token = res.body.token;
  });

  describe("GET - Cart Router => /api/carts", () => {
    it("should return a cart by id", async () => {
      const response = await request.get(`/api/carts/${cid}`)
      .set('Cookie', `tokenJWT=${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("payload");
    });

    it("should return a error message when cart not found", async () => {
      const response = await request.get("/api/carts/65ade253107bd2de64d75591")
      .set('Cookie', `tokenJWT=${token}`);
      
      expect(response.body).toHaveProperty("error");
      expect(response.body.message).toEqual("Cart not found");
    });
  });

  describe("POST - Cart Router => /api/carts", () => {
    it("should add product to cart", async () => {
      const response = await request
        .post(`/api/carts/${cid}/product/652c49ab7f1c544dc8ccd05b`)
        .set('Cookie', `tokenJWT=${token}`);
        
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("payload");
    });

    it("should return a error message when cart not found", async () => {
      const response = await request
        .post("/api/carts/65ade253107bd2de64d75591/product/652c49ab7f1c544dc8ccd05b")
        .set('Cookie', `tokenJWT=${token}`);
        
      expect(response.body).toHaveProperty("error");
      expect(response.body.message).toEqual("Cart not found");
    });

    it("should return a error message when product not found", async () => {
      const response = await request
        .post(`/api/carts/${cid}/product/652c49ab7f1c544dc8ccd05a`)
        .set('Cookie', `tokenJWT=${token}`);
        
      expect(response.body).toHaveProperty("error");
      expect(response.body.message).toEqual("Product not found");
    });
  });

  describe("DELETE - Cart Router => /api/carts/:cid/product/:pid", () => {
    it("should delete product from cart", async () => {
      const response = await request
        .delete(`/api/carts/${cid}/products/652c49ab7f1c544dc8ccd05b`)
        .set('Cookie', `tokenJWT=${token}`);
        
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("payload");
    });

    it("should return a error message when cart not found", async () => {
      const response = await request
        .delete("/api/carts/65ade253107bd2de64d75591/products/652c49ab7f1c544dc8ccd05b")
        .set('Cookie', `tokenJWT=${token}`);
        
      expect(response.body).toHaveProperty("error");
      expect(response.body.message).toEqual("Cart not found");
    });

    it("should return a error message when product not found", async () => {
      const response = await request
        .delete(`/api/carts/${cid}/products/652c49ab7f1c544dc8ccd05a`)
        .set('Cookie', `tokenJWT=${token}`);
        
      expect(response.body).toHaveProperty("error");
      expect(response.body.message).toEqual("Product not found");
    });

    it("should return a error message when product not found in cart", async () => {
      const response = await request
        .delete(`/api/carts/${cid}/products/652c49707f1c544dc8ccd053`)
        .set('Cookie', `tokenJWT=${token}`);
        
      expect(response.body).toHaveProperty("error");
      expect(response.body.message).toEqual("Product not found in cart");
    });
  });
});
