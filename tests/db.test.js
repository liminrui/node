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
test("db test && instance method", async () => {
  await UserModel.deleteOne({ username: "lmr" });

  const user = new UserModel({
    username: "lmr",
    password: "123456",
  });

  await user.save();

  const userItem = await UserModel.findOne({ username: "lmr" });

  //   expect(userItem.password).toBe("123456");

  const users = await UserModel.find();

  expect(users.length).toBe(1);
  expect(users[0].username).toBe("lmr");

  expect(
    await UserModel.login({
      username: user.username,
      password: "123456",
    })
  ).toBe("校验正确");

  const user2 = new UserModel({
    username: "hahah",
    password: "111111",
  });

  expect(
    await UserModel.login({
      username: user2.username,
      password: user2.password,
    })
  ).toBe("不存在该用户");

  const user3 = new UserModel({
    username: "lmr",
    password: "222222",
  });

  expect(
    await UserModel.login({
      username: user3.username,
      password: user3.password,
    })
  ).toBe("密码错误");

  //   expect(user.peronInfo).toBe("my name is :lmr and my pwd is 123456");
});

test("test instance method", async () => {
  const user = await UserModel.findByName("lmr");

  expect(user.password).toBe("123456");
});