const app = require("../app");
const request = require("superkoa");

describe("db", () => {
  test("user /", async () => {
    const res = await request(app)
      .post("/users")
      .send({ username: "liminrui", password: 123456 });

    expect(res.body.status.code).toBe(0);
  });
});
