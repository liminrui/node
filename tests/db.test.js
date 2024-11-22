const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const UserModel = require("../model/user");
const genUserData = require("../utils/gen");
const { Story, Person } = require("../model/populate");
// const { describe } = require("node:test");

let mongoServer = null;
let db = null;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  db = await mongoose.connect(mongoServer.getUri(), {
    dbName: "verifyMASTER",
  });

  expect(db).toBeDefined();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("page", () => {
  // 插入多条数据
  test("insertMany", async () => {
    const data = genUserData(10);
    await UserModel.insertMany(data);
  });
  // 测试插入是否成功
  test("find all", async () => {
    const userList = await UserModel.find();

    expect(userList.length).toBeGreaterThanOrEqual(10);
  });
  // 分页查询
  test("search by split", async () => {
    const result = await UserModel.find().skip(3).limit(3);

    expect(result.length).toBe(3);

    // 通过last_id来分页查询
    const users = await UserModel.find().limit(3);
    const last_id = users[2].id;
    let res = await UserModel.find({
      _id: {
        $gt: last_id,
      },
    }).limit(3);

    expect(result).toEqual(res);
  });
});

describe("populate", () => {
  test("save instance", async () => {
    const author = new Person({
      _id: new mongoose.Types.ObjectId(),
      name: "Ian Fleming",
      age: 50,
    });

    await author.save();

    const data = await Person.find();
    expect(data.length).toBe(1);

    const story1 = new Story({
      title: "Casino Royale",
      author: author._id, // assign the _id from the person
    });

    await story1.save();

    const story = await Story.findOne({ title: "Casino Royale" })
      .populate("author")
      .exec();

    expect(story.author.name).toBe("Ian Fleming");
  });
});

describe("aggerate", () => {
  test("search by aggregate", async () => {
    const OrderModel = require("../model/order");

    await OrderModel.insertMany([
      {
        _id: 0,
        name: "Pepperoni",
        size: "small",
        price: 19,
        quantity: 10,
        date: Date("2021-03-13T08:14:30Z"),
      },
      {
        _id: 1,
        name: "Pepperoni",
        size: "medium",
        price: 20,
        quantity: 20,
        date: Date("2021-03-13T09:13:24Z"),
      },
      {
        _id: 2,
        name: "Pepperoni",
        size: "large",
        price: 21,
        quantity: 30,
        date: Date("2021-03-17T09:22:12Z"),
      },
      {
        _id: 3,
        name: "Cheese",
        size: "small",
        price: 12,
        quantity: 15,
        date: Date("2021-03-13T11:21:39.736Z"),
      },
      {
        _id: 4,
        name: "Cheese",
        size: "medium",
        price: 13,
        quantity: 50,
        date: Date("2022-01-12T21:23:13.331Z"),
      },
      {
        _id: 5,
        name: "Cheese",
        size: "large",
        price: 14,
        quantity: 10,
        date: Date("2022-01-12T05:08:13Z"),
      },
      {
        _id: 6,
        name: "Vegan",
        size: "small",
        price: 17,
        quantity: 10,
        date: Date("2021-01-13T05:08:13Z"),
      },
      {
        _id: 7,
        name: "Vegan",
        size: "medium",
        price: 18,
        quantity: 10,
        date: Date("2021-01-13T05:10:13Z"),
      },
    ]);
    const res = await OrderModel.aggregate([
      // Stage 1: Filter pizza order documents by pizza size
      {
        $match: { size: "medium" },
      },
      // Stage 2: Group remaining documents by pizza name and calculate total quantity
      {
        $group: { _id: "$name", totalQuantity: { $sum: "$quantity" } },
      },
    ]);

    expect(res.length).toBe(3);
  });

  test("add or remove field", async () => {
    const labModel = require("../model/labReading");

    await labModel.insertMany([
      {
        date: Date("2021-01-13T05:08:13Z"),
        temperature: 80,
      },
      {
        date: null,
        temperature: 83,
      },
      {
        date: Date("2021-01-13T05:08:13Z"),
        temperature: 85,
      },
    ]);

    const res = await labModel.aggregate([
      {
        $addFields: {
          date: {
            $ifNull: ["$date", "$$REMOVE"],
          },
        },
      },
    ]);

    expect(res.length).toBe(3);

    // const res2 = await labModel.find();
  });

  test("bucket", async () => {
    const ArtistModel = require("../model/artists");
    await ArtistModel.insertMany([
      {
        _id: 1,
        last_name: "Bernard",
        first_name: "Emil",
        year_born: 1868,
        year_died: 1941,
        nationality: "France",
      },
      {
        _id: 2,
        last_name: "Rippl-Ronai",
        first_name: "Joszef",
        year_born: 1861,
        year_died: 1927,
        nationality: "Hungary",
      },
      {
        _id: 3,
        last_name: "Ostroumova",
        first_name: "Anna",
        year_born: 1871,
        year_died: 1955,
        nationality: "Russia",
      },
      {
        _id: 4,
        last_name: "Van Gogh",
        first_name: "Vincent",
        year_born: 1853,
        year_died: 1890,
        nationality: "Holland",
      },
      {
        _id: 5,
        last_name: "Maurer",
        first_name: "Alfred",
        year_born: 1868,
        year_died: 1932,
        nationality: "USA",
      },
      {
        _id: 6,
        last_name: "Munch",
        first_name: "Edvard",
        year_born: 1863,
        year_died: 1944,
        nationality: "Norway",
      },
      {
        _id: 7,
        last_name: "Redon",
        first_name: "Odilon",
        year_born: 1840,
        year_died: 1916,
        nationality: "France",
      },
      {
        _id: 8,
        last_name: "Diriks",
        first_name: "Edvard",
        year_born: 1855,
        year_died: 1930,
        nationality: "Norway",
      },
    ]);

    // 添加bucket查询
    const res = await ArtistModel.aggregate([
      {
        $bucket: {
          groupBy: "$year_born",
          boundaries: [1840, 1850, 1860, 1870, 1880], // Boundaries for the buckets
          default: "Other", // Bucket ID for documents which do not fall into a bucket
          output: {
            // Output for each bucket
            count: { $sum: 1 },
            artists: {
              $push: {
                name: { $concat: ["$first_name", " ", "$last_name"] },
                year_born: "$year_born",
              },
            },
          },
        },
      },
      {
        $match: { count: { $gt: 3 } },
      },
    ]);
    const res2 = await ArtistModel.aggregate([
      {
        $bucketAuto: {
          groupBy: "$year_born",
          buckets: 5,
        },
      },
    ]);
  });

  test("unwind", async () => {
    const InventoryModel = require("../model/inventory");
    // const inventory = new InventoryModel({
    //   _id: 1,
    //   item: "ABC1",
    //   sizes: ["S", "M", "L"],
    // });

    // await inventory.save();

    await InventoryModel.insertMany([
      { _id: 1, item: "Shirt", price: 3, sizes: ["S", "M", "L"] },
      { _id: 2, item: "Shorts", price: 5, sizes: [] },
      { _id: 3, item: "Hat", sizes: "M", price: 8 },
      { _id: 4, item: "Gloves", price: 10 },
      { _id: 5, item: "Scarf", sizes: null, price: 12 },
    ]);

    const res = await InventoryModel.aggregate([
      {
        $unwind: {
          path: "$sizes",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$sizes",
          averagePrice: { $avg: "$price" },
        },
      },
      {
        $sort: { averagePrice: -1 },
      },
    ]);

    expect(res.length).toBe(4);
  });

  test("facet", async () => {
    const ArtWorkModel = require("../model/artwork");

    await ArtWorkModel.insertMany([
      {
        _id: 1,
        title: "The Pillars of Society",
        artist: "Grosz",
        year: 1926,
        price: Number("199.99"),
        tags: ["painting", "satire", "Expressionism", "caricature"],
      },
      {
        _id: 2,
        title: "Melancholy III",
        artist: "Munch",
        year: 1902,
        price: Number("280.00"),
        tags: ["woodcut", "Expressionism"],
      },
      {
        _id: 3,
        title: "Dancer",
        artist: "Miro",
        year: 1925,
        price: Number("76.04"),
        tags: ["oil", "Surrealism", "painting"],
      },
      {
        _id: 4,
        title: "The Great Wave off Kanagawa",
        artist: "Hokusai",
        price: Number("167.30"),
        tags: ["woodblock", "ukiyo-e"],
      },
      {
        _id: 5,
        title: "The Persistence of Memory",
        artist: "Dali",
        year: 1931,
        price: Number("483.00"),
        tags: ["Surrealism", "painting", "oil"],
      },
      {
        _id: 6,
        title: "Composition VII",
        artist: "Kandinsky",
        year: 1913,
        price: Number("385.00"),
        tags: ["oil", "painting", "abstract"],
      },
      {
        _id: 7,
        title: "The Scream",
        artist: "Munch",
        year: 1893,
        tags: ["Expressionism", "painting", "oil"],
      },
      {
        _id: 8,
        title: "Blue Flower",
        artist: "O'Keefe",
        year: 1918,
        price: Number("118.42"),
        tags: ["abstract", "painting"],
      },
    ]);

    const res = await ArtWorkModel.aggregate([
      {
        $facet: {
          sortByTags: [{ $unwind: "$tags" }, { $sortByCount: "$tags" }],
          "categorizedByYears(Auto)": [
            {
              $bucketAuto: {
                groupBy: "$year",
                buckets: 4,
              },
            },
          ],
        },
      },
    ]);
  });

  test("count", async () => {
    const ScoreModel = require("../model/score");

    await ScoreModel.insertMany([
      { _id: 1, subject: "History", score: 88 },
      { _id: 2, subject: "History", score: 92 },
      { _id: 3, subject: "History", score: 97 },
      { _id: 4, subject: "History", score: 71 },
      { _id: 5, subject: "History", score: 79 },
      { _id: 6, subject: "History", score: 83 },
    ]);

    const res = await ScoreModel.aggregate([
      {
        $match: {
          score: {
            $gt: 80,
          },
        },
      },
      {
        $count: "test_count",
      },
    ]);
  });

  test("fill", async () => {
    const RestaurantModel = require("../model/restaurantReview");

    await RestaurantModel.insertMany([
      {
        date: Date("2021-03-08"),
        score: 90,
      },
      {
        date: Date("2021-03-09"),
        score: 92,
      },
      {
        date: Date("2021-03-10"),
      },
      {
        date: Date("2021-03-11"),
      },
      {
        date: Date("2021-03-12"),
        score: 85,
      },
      {
        date: Date("2021-03-13"),
      },
    ]);

    const res = await RestaurantModel.aggregate([
      {
        $set: {
          valueExist: {
            $ifNull: [
              {
                $toBool: { $toString: "$score" },
              },
              false,
            ],
          },
        },
      },
      {
        $fill: {
          sortBy: {
            date: 1,
          },
          output: {
            score: {
              method: "locf",
            },
          },
        },
      },
    ]);
  });

  test("near", async () => {
    const PlaceModel = require("../model/place");
    await PlaceModel.insertMany([
      {
        name: "Central Park",
        location: { type: "Point", coordinates: [-73.97, 40.77] },
        category: "Parks",
      },
      {
        name: "Sara D. Roosevelt Park",
        location: { type: "Point", coordinates: [-73.9928, 40.7193] },
        category: "Parks",
      },
      {
        name: "Polo Grounds",
        location: { type: "Point", coordinates: [-73.9375, 40.8303] },
        category: "Stadiums",
      },
    ]);

    const res = await PlaceModel.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [-73.99279, 40.719296] },
          distanceField: "dist.calculated",
          maxDistance: 2,
          query: { category: "Parks" },
          includeLocs: "dist.location",
          spherical: true,
        },
      },
    ]);
  });

  test("lookup", async () => {
    const OrderModel = require("../model/order");
    const InventoryModel = require("../model/inventory");

    await OrderModel.insertMany([
      { _id: 1, item: "almonds", price: 12, quantity: 2 },
      { _id: 2, item: "pecans", price: 20, quantity: 1 },
      { _id: 3 },
    ]);

    await InventoryModel.insertMany([
      { _id: 1, sku: "almonds", description: "product 1", instock: 120 },
      { _id: 2, sku: "bread", description: "product 2", instock: 80 },
      { _id: 3, sku: "cashews", description: "product 3", instock: 60 },
      { _id: 4, sku: "pecans", description: "product 4", instock: 70 },
      { _id: 5, sku: null, description: "Incomplete" },
      { _id: 6 },
    ]);

    const res = await OrderModel.aggregate([
      {
        $lookup: {
          from: InventoryModel.collection.name,
          let: { price: "$price", name: "$item" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$sku", "$$name"] },
                    { $gte: ["$instock", "$$price"] },
                  ],
                },
              },
            },
            // { $project: { sku: 0, _id: 0 } },
          ],
          as: "stockdata",
        },
      },
    ]);
    console.log("res: ", res);
  });

  test("merge", async () => {
    const SaleModel = require("../model/sales");
    await SaleModel.insertMany([
      {
        _id: 1,
        year: 2017,
        item: "A",
        quantity: { "2017Q1": 500, "2017Q2": 500 },
      },
      {
        _id: 2,
        year: 2016,
        item: "A",
        quantity: { "2016Q1": 400, "2016Q2": 300, "2016Q3": 0, "2016Q4": 0 },
      },
      { _id: 3, year: 2017, item: "B", quantity: { "2017Q1": 300 } },
      {
        _id: 4,
        year: 2016,
        item: "B",
        quantity: { "2016Q3": 100, "2016Q4": 250 },
      },
    ]);

    const res = await SaleModel.aggregate([
      {
        $group: {
          _id: "$item",
          mergedSales: { $mergeObjects: "$quantity" },
        },
      },
    ]);
    //

    //
    const OrderModel = require("../model/order");
    const ItemModel = require("../model/items");

    await ItemModel.insertMany([
      { _id: 1, item: "abc", description: "product 1", instock: 120 },
      { _id: 2, item: "def", description: "product 2", instock: 80 },
      { _id: 3, item: "jkl", description: "product 3", instock: 60 },
    ]);

    await OrderModel.insertMany([
      { _id: 1, item: "abc", price: 12, ordered: 2 },
      { _id: 2, item: "jkl", price: 20, ordered: 1 },
    ]);

    const res2 = await OrderModel.aggregate([
      {
        $lookup: {
          from: ItemModel.collection.name,
          localField: "item", // field in the orders collection
          foreignField: "item", // field in the items collection
          as: "fromItems",
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ $arrayElemAt: ["$fromItems", 0] }, "$$ROOT"],
          },
        },
      },
      { $project: { fromItems: 0 } },
    ]);
  });
});

test("bcrypt password", async () => {
  expect(
    await UserModel.login({
      username: "lmr",
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
});
