const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const UserModel = require("../model/user");
// mongoose.set("debug", true);

let mongoServer = null;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const db = await mongoose.connect(mongoServer.getUri(), {
    dbName: "verifyMASTER",
  });

  expect(db).toBeDefined();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

test("db test", async () => {
  await UserModel.deleteOne({ username: "lmr" });

  const user = new UserModel({
    username: "lmr",
    password: "123456",
  });

  await user.save();

  const userItem = await UserModel.findOne({ username: "lmr" });

  expect(userItem.password).toBe("123456");
});
