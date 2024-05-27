import mongoose from "mongoose";
import app from "../app.js";
import request from "supertest";
import {
  findUser,
  saveUser,
  deleteAllUsers,
} from "../services/authServices.js";

const { DB_TEST_HOST, PORT } = process.env;

describe("test /api/users/login", () => {
  let server = null;

  beforeAll(async () => {
    await mongoose.connect(DB_TEST_HOST);
    server = app.listen(PORT);
    await saveUser({
      email: "anna@gmail.com",
      password: "fhdkovkd1254",
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  afterEach(async () => {
    await deleteAllUsers();
  });

  test("test login with correct data", async () => {
    const loginData = {
      email: "anna@gmail.com",
      password: "fhdkovkd1254",
    };
    const { statusCode, body } = await request(app)
      .post("/api/users/login")
      .send(loginData);

    expect(statusCode).toBe(200);
    expect(body.token).toBeDefined();
    expect(typeof body.token).toBe("string");
    expect(typeof body.user).toBe("object");
    expect(Object.keys(body.user).length).toBe(2);
    expect(typeof body.user.email).toBe("string");
    expect(typeof body.user.subscription).toBe("string");

    const user = await findUser({ email: loginData.email });
    expect(user).not.toBeNull;
    expect(user.email).toBe(loginData.email);
  });
});
