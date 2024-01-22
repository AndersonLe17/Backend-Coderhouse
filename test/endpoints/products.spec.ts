import supertest from "supertest";

const request = supertest("http://localhost:8080");

describe("Products Endpoints", () => {
  describe("GET - Product Router => /api/products", () => {
    it("should return all products", async () => {
      const response = await request.get("/api/products");
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("payload");
    });
  });

  describe("GET - Product Router => /api/products/:id", () => {
    it("should return a product code by id", async () => {
      const response = await request.get("/api/products/652c4dfe7f1c544dc8ccd07f");
      
      expect(response.status).toBe(200);
      expect(response.body.payload.code).toEqual("VID-008");
    });

    it("should return a error message when product not found", async () => {
      const response = await request.get("/api/products/652c4dfe7f1c544dc8ccd00f");
      
      expect(response.body).toHaveProperty("error");
      expect(response.body.message).toEqual("Product not found");
    });
  });

  describe("POST - Product Router => /api/products", () => {
    let token: string;
    beforeAll(async () => {
      const res = await request.post("/api/sessions/login")
      .send({
        email: "adminCoder@coder.com",
        password: "coderhouse",
      });

      token = res.body.token;
    });
    it("should create a new product", async () => {
      const response = await request
        .post("/api/products")
        .set('Cookie', `tokenJWT=${token}`)
        .send({
          title: "Product Test",
          description: "Product Test Description",
          price: 10.00,
          code: "TST-001",
          stock: 10,
          category: "Test"
        });
        
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("payload");
    });

    it("should return a error when product already exists", async () => {
      const response = await request
        .post("/api/products")
        .set('Cookie', `tokenJWT=${token}`)
        .send({
          title: "Product Test",
          description: "Product Test Description",
          price: 10.00,
          code: "TST-001",
          stock: 10,
          category: "Test"
        });
      
      expect(response.body).toHaveProperty("error");
    });
    afterAll(async () => {
      await request.delete("/api/products/delete/test");
    });
  });
});
