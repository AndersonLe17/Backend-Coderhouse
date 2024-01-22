import supertest from "supertest";

const request = supertest("http://localhost:8080");

describe("Sessions Endpoints", () => {
  describe("POST - Session Router => /api/sessions/login", () => {
    it("should create a new session", async () => {
      const response = await request
        .post("/api/sessions/login")
        .send({
          email: "adminCoder@coder.com",
          password: "coderhouse",
        });
      
      expect(response.status).toBe(200);
      expect(response.body.message).toEqual("Logged in");
      expect(response.body).toHaveProperty("token");
    });

    it("should return error when credentials are wrong", async () => {
      const response = await request
        .post("/api/sessions/login")
        .send({
          email: "adminCoder@coder.com",
          password: "12345678",
        });

      expect(response.body).toHaveProperty("error");
      expect(response.body.message).toEqual("Unauthorized");
    });
  });

  describe("POST - Session Router => /api/sessions/register", () => {
    it("should create a new user", async () => {
      const response = await request
        .post("/api/sessions/register")
        .send({
          firstName: "Testing",
          lastName: "User",
          age: "18",
          email: "tester@test.com",
          password: "testing"
        });
      
      expect(response.status).toBe(201);
      expect(response.body.status).toEqual("Created");
    });

    it("should return error when user already exists", async () => {
      const response = await request
        .post("/api/sessions/register")
        .send({
          firstName: "Testing",
          lastName: "User",
          age: "18",
          email: "tester@test.com",
          password: "testing"
        });
      
      expect(response.body).toHaveProperty("error");
      expect(response.body.status).toEqual("Error");
    });

    afterAll(async () => {
      await request.delete("/api/users/test/delete/tester@test.com");
    });
  });

  describe("GET - Session Router => /api/sessions/current", () => {
    let token: string;
    beforeAll(async () => {
      const res = await request.post("/api/sessions/login")
      .send({
        email: "adminCoder@coder.com",
        password: "coderhouse",
      });

      token = res.body.token;
    });

    it("should return current user", async () => {
      const response = await request.get("/api/sessions/current")
      .set('Cookie', `tokenJWT=${token}`);

      expect(response.status).toBe(200);
      expect(response.body.email).toEqual("adminCoder@coder.com");
    });
  });
});
