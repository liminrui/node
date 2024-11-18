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

// 只运行这一条
test.only("db test && instance method", async () => {
  await UserModel.deleteOne({ username: "lmr" });

  const user = new UserModel({
    username: "lmr",
    password: "123456",
  });

  await user.save();

  const userItem = await UserModel.findOne({ username: "lmr" });

  expect(userItem.password).toBe("123456");

  const users = await UserModel.find();

  expect(users.length).toBe(1);
  expect(users[0].username).toBe("lmr");

  expect(user.peronInfo).toBe("my name is :lmr and my pwd is 123456");
});

test("test instance method", async () => {
  const user = await UserModel.findByName("lmr");

  expect(user.password).toBe("123456");
});
