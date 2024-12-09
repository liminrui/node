const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const UserModel = require("../model/user");
const genUserData = require("../utils/gen");
const { Story, Person } = require("../model/populate");
const OrderModel = require("../model/order");
// const { describe } = require("node:test");

let mongoServer = null;
let db = null;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  db = await mongoose.connect(mongoServer.getUri(), {
    dbName: "verifyMASTER",
  });

  expect(db).toBeDefined();
  //
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
      age: 40,
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
          buckets: 4,
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
          sortByTags: [{ $unwind: "$tags" }, { $sortByCount: "$tags" }], // 输出[{ _id: "$tags", count: <value> }]
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
              method: "locf", // 如果填写的字段包含 null 和非空值，locf 会根据 sortBy 排序将 null 和缺失值设置为该字段的最后一个已知非空值。
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
          spherical: true, // 使用球面坐标
        },
      },
    ]);
  });

  test("lookup", async () => {
    // const OrderModel = require("../model/order");
    // const InventoryModel = require("../model/inventory");

    // await OrderModel.insertMany([
    //   { _id: 1, item: "almonds", price: 12, quantity: 2 },
    //   { _id: 2, item: "pecans", price: 20, quantity: 1 },
    //   { _id: 3 },
    // ]);

    // await InventoryModel.insertMany([
    //   { _id: 1, sku: "almonds", description: "product 1", instock: 120 },
    //   { _id: 2, sku: "bread", description: "product 2", instock: 80 },
    //   { _id: 3, sku: "cashews", description: "product 3", instock: 60 },
    //   { _id: 4, sku: "pecans", description: "product 4", instock: 70 },
    //   // { _id: 5, sku: null, description: "Incomplete" },
    //   // { _id: 6 },
    // ]);

    // const res = await OrderModel.aggregate([
    //   {
    //     $lookup: {
    //       from: InventoryModel.collection.name,
    //       let: { price: "$price", name: "$item" },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [
    //                 { $eq: ["$sku", "$$name"] },
    //                 { $gte: ["$instock", "$$price"] },
    //               ],
    //             },
    //           },
    //         },
    //         // { $project: { sku: 0, _id: 0 } },
    //       ],
    //       as: "stockdata",
    //     },
    //   },
    // ]);

    const AbsenceModel = require("../model/absence");
    await AbsenceModel.insertMany([
      {
        _id: 1,
        student: "Ann Aardvark",
        sickdays: [new Date("2018-05-01"), new Date("2018-08-23")],
      },
      {
        _id: 2,
        student: "Zoe Zebra",
        sickdays: [new Date("2018-02-01"), new Date("2018-05-23")],
      },
    ]);

    const HolidayModel = require("../model/holiday");
    await HolidayModel.insertMany([
      { _id: 1, year: 2018, name: "New Years", date: new Date("2018-01-01") },
      { _id: 2, year: 2018, name: "Pi Day", date: new Date("2018-03-14") },
      {
        _id: 3,
        year: 2018,
        name: "Ice Cream Day",
        date: new Date("2018-07-15"),
      },
      { _id: 4, year: 2017, name: "New Years", date: new Date("2017-01-01") },
      {
        _id: 5,
        year: 2017,
        name: "Ice Cream Day",
        date: new Date("2017-07-16"),
      },
    ]);

    const res2 = await AbsenceModel.aggregate([
      {
        $lookup: {
          from: HolidayModel.collection.name,
          pipeline: [
            { $match: { year: 2018 } },
            // 两者写法等价
            // { $project: { _id: 0, date: { name: "$name", date: "$date" } } },
            // { $replaceRoot: { newRoot: "$date" } },
            { $project: { _id: 0, name: "$name", date: "$date" } },
          ],
          as: "holidays",
        },
      },
    ]);
    //

    const RestaurantModel = require("../model/restaurant");
    const ItemModel = require("../model/items");

    await RestaurantModel.insertMany([
      {
        _id: 1,
        name: "American Steak House",
        food: ["filet", "sirloin"],
        beverages: ["beer", "wine"],
      },
      {
        _id: 2,
        name: "Honest John Pizza",
        food: ["cheese pizza", "pepperoni pizza"],
        beverages: ["soda"],
      },
    ]);

    await ItemModel.insertMany([
      {
        _id: 1,
        item: "filet",
        restaurant_name: "American Steak House",
      },
      {
        _id: 2,
        item: "cheese pizza",
        restaurant_name: "Honest John Pizza",
        drink: "lemonade",
      },
      {
        _id: 3,
        item: "cheese pizza",
        restaurant_name: "Honest John Pizza",
        drink: "soda",
      },
    ]);

    const res4 = await ItemModel.aggregate([
      {
        $lookup: {
          from: RestaurantModel.collection.name,
          localField: "restaurant_name",
          foreignField: "name",
          let: {
            drink_order: "$drink",
          },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$$drink_order", "$beverages"] },
              },
            },
          ],
          as: "matches",
        },
      },
    ]);
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

    // await SaleModel.aggregate()

    //
    // const OrderModel = require("../model/order");
    // const ItemModel = require("../model/items");

    // await ItemModel.insertMany([
    //   { _id: 1, item: "abc", description: "product 1", instock: 120 },
    //   { _id: 2, item: "def", description: "product 2", instock: 80 },
    //   { _id: 3, item: "jkl", description: "product 3", instock: 60 },
    // ]);

    // await OrderModel.insertMany([
    //   { _id: 1, item: "abc", price: 12, ordered: 2 },
    //   { _id: 2, item: "jkl", price: 20, ordered: 1 },
    // ]);

    // const res2 = await OrderModel.aggregate([
    //   {
    //     $lookup: {
    //       from: ItemModel.collection.name,
    //       localField: "item", // field in the orders collection
    //       foreignField: "item", // field in the items collection
    //       as: "fromItems",
    //     },
    //   },
    //   {
    //     // { $replaceRoot: { newRoot: <replacementDocument> } }
    //     $replaceRoot: {
    //       newRoot: {
    //         $mergeObjects: [{ $arrayElemAt: ["$fromItems", 0] }, "$$ROOT"],
    //       },
    //     },
    //   },
    //   { $project: { fromItems: 0 } },
    // ]);
  });

  test("sort", async () => {
    const RestaurantModel = require("../model/restaurant");
    await RestaurantModel.insertMany([
      { _id: 1, name: "Central Park Cafe", borough: "Manhattan" },
      { _id: 2, name: "Rock A Feller Bar and Grill", borough: "Queens" },
      { _id: 3, name: "Empire State Pub", borough: "Brooklyn" },
      { _id: 4, name: "Stan's Pizzaria", borough: "Manhattan" },
      { _id: 5, name: "Jane's Deli", borough: "Brooklyn" },
    ]);

    const res = await RestaurantModel.aggregate([
      {
        /**
         * 如果对多个字段进行排序，则按从左到右的顺序进行排序。例如，在上面的表单中，文档首先按 <field1> 排序。然后，具有相同 <field1> 值的文档将按 <field2> 进一步排序。
         */
        $sort: {
          borough: 1,
          _id: -1,
        },
      },
    ]);
    //

    // 数组排序
    /**
     *  在升序排序中，排序键是数组中的最低值。
        在降序排序中，排序键是数组中的最高值。
     */
    const ShoeModel = require("../model/shoe");
    await ShoeModel.insertMany([
      { _id: "A", sizes: [7, 11] },
      { _id: "B", sizes: [8, 9, 10] },
    ]);

    const res2 = await ShoeModel.aggregate([
      {
        $sort: {
          sizes: 1,
        },
      },
    ]);

    const res3 = await ShoeModel.aggregate([
      {
        $sort: {
          sizes: -1,
        },
      },
    ]);

    //
  });

  test("group", async () => {
    const SaleModel = require("../model/sales");
    await SaleModel.insertMany([
      {
        _id: 1,
        item: "abc",
        price: 10,
        quantity: 2,
        date: "2014-03-01T08:00:00Z",
      },
      {
        _id: 2,
        item: "jkl",
        price: 20,
        quantity: 1,
        date: "2014-03-01T09:00:00Z",
      },
      {
        _id: 3,
        item: "xyz",
        price: 5,
        quantity: 10,
        date: "2014-03-15T09:00:00Z",
      },
      {
        _id: 4,
        item: "xyz",
        price: 5,
        quantity: 20,
        date: "2014-04-04T11:21:39.736Z",
      },
      {
        _id: 5,
        item: "abc",
        price: 10,
        quantity: 10,
        date: "2014-04-04T21:23:13.331Z",
      },
      {
        _id: 6,
        item: "def",
        price: 7.5,
        quantity: 5,
        date: "2015-06-04T05:08:13Z",
      },
      {
        _id: 7,
        item: "def",
        price: 7.5,
        quantity: 10,
        date: "2015-09-10T08:43:00Z",
      },
      {
        _id: 8,
        item: "abc",
        price: 10,
        quantity: 5,
        date: "2016-02-06T20:20:13Z",
      },
    ]);

    const res = await SaleModel.aggregate([
      {
        $match: {
          date: {
            $gte: new Date("2014-01-01"),
            $lt: new Date("2015-01-01"),
          },
        },
      },
      // Second Stage
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalSaleAmount: { $sum: { $multiply: ["$price", "$quantity"] } },
          averageQuantity: { $avg: "$quantity" },
          count: { $sum: 1 },
        },
      },
      // Third Stage
      {
        $sort: { totalSaleAmount: -1 },
      },
    ]);

    //

    // 下面的聚合操作指定了 null 的 _id 组，计算集合中所有文档的总销售额、平均数量和计数
    const res2 = await SaleModel.aggregate([
      {
        $group: {
          _id: null,
          totalSaleAmount: { $sum: { $multiply: ["$price", "$quantity"] } },
          averageQuantity: { $avg: "$quantity" },
          count: { $sum: 1 },
        },
      },
    ]);
    //

    const BookModel = require("../model/book");
    await BookModel.insertMany([
      { _id: 8751, title: "The Banquet", author: "Dante", copies: 2 },
      { _id: 8752, title: "Divine Comedy", author: "Dante", copies: 1 },
      { _id: 8645, title: "Eclogues", author: "Dante", copies: 2 },
      { _id: 7000, title: "The Odyssey", author: "Homer", copies: 10 },
      { _id: 7020, title: "Iliad", author: "Homer", copies: 10 },
    ]);

    const res3 = await BookModel.aggregate([
      { $group: { _id: "$author", books: { $push: "$$ROOT" } } },
      {
        $addFields: {
          totalCopies: { $sum: "$books.copies" },
        },
      },
    ]);
  });

  test("project", async () => {
    const BookModel = require("../model/book");

    await BookModel.insertMany([
      {
        _id: 1,
        title: "abc123",
        isbn: "0001122223334",
        author: { last: "zzz", first: "aaa" },
        copies: 5,
        lastModified: Date("2016-07-28"),
      },
      {
        _id: 2,
        title: "Baked Goods",
        isbn: "9999999999999",
        author: { last: "xyz", first: "abc", middle: "" },
        copies: 2,
        lastModified: Date("2017-07-21"),
      },
      {
        _id: 3,
        title: "Ice Cream Cakes",
        isbn: "8888888888888",
        author: { last: "xyz", first: "abc", middle: "mmm" },
        copies: 5,
        lastModified: Date("2017-07-22"),
      },
    ]);

    const res = await BookModel.aggregate([
      {
        $project: {
          title: 1,
          "author.first": 1,
          "author.last": 1,
          "author.middle": {
            $cond: {
              // 条件判断
              if: { $eq: ["", "$author.middle"] },
              then: "$$REMOVE",
              else: "$author.middle",
            },
          },
        },
      },
    ]);

    // 添加字段并切割字符串
    const res2 = await BookModel.aggregate([
      {
        $project: {
          title: 1,
          isbn: {
            prefix: { $substr: ["$isbn", 0, 3] },
            group: { $substr: ["$isbn", 3, 2] },
            publisher: { $substr: ["$isbn", 5, 4] },
            title: { $substr: ["$isbn", 9, 3] },
            checkDigit: { $substr: ["$isbn", 12, 1] },
          },
          lastName: "$author.last",
          copiesSold: "$copies",
        },
      },
    ]);
  });

  test("setintersection", async () => {
    const FlowerModel = require("../model/flower");
    await FlowerModel.insertMany([
      {
        _id: 1,
        flowerFieldA: ["rose", "orchid"],
        flowerFieldB: ["rose", "orchid"],
      },
      {
        _id: 2,
        flowerFieldA: ["rose", "orchid"],
        flowerFieldB: ["orchid", "rose", "orchid"],
      },
      {
        _id: 3,
        flowerFieldA: ["rose", "orchid"],
        flowerFieldB: ["rose", "orchid", "jasmine"],
      },
      {
        _id: 4,
        flowerFieldA: ["rose", "orchid"],
        flowerFieldB: ["jasmine", "rose"],
      },
      { _id: 5, flowerFieldA: ["rose", "orchid"], flowerFieldB: [] },
      {
        _id: 6,
        flowerFieldA: ["rose", "orchid"],
        flowerFieldB: [["rose"], ["orchid"]],
      },
      {
        _id: 7,
        flowerFieldA: ["rose", "orchid"],
        flowerFieldB: [["rose", "orchid"]],
      },
      { _id: 8, flowerFieldA: [], flowerFieldB: [] },
      { _id: 9, flowerFieldA: [], flowerFieldB: ["rose"] },
    ]);

    const res = await FlowerModel.aggregate([
      {
        $project: {
          flowerFieldA: 1,
          flowerFieldB: 1,
          commonToBoth: {
            $setIntersection: ["$flowerFieldA", "$flowerFieldB"], // 取交集
          },
          _id: 0,
        },
      },
    ]);
  });

  test("redact", async () => {
    const ForecastModel = require("../model/forecasts");

    // await ForecastModel.inse
    const forecast = new ForecastModel({
      _id: 1,
      title: "123 Department Report",
      tags: ["G", "STLW"],
      year: 2014,
      subsections: [
        {
          subtitle: "Section 1: Overview",
          tags: ["SI", "G"],
          content: "Section 1: This is the content of section 1.",
        },
        {
          subtitle: "Section 2: Analysis",
          tags: ["TK"],
          content: "Section 2: This is the content of section 2.",
        },
        {
          subtitle: "Section 3: Budgeting",
          tags: ["TK"],
          content: {
            text: "Section 3: This is the content of section 3.",
            tags: ["HCS"],
          },
        },
      ],
    });

    await forecast.save();

    var userAccess = ["TK", "STLW"];
    const res = await ForecastModel.aggregate([
      { $match: { year: 2014 } },
      {
        $redact: {
          $cond: {
            if: {
              $gt: [{ $size: { $setIntersection: ["$tags", userAccess] } }, 0],
            },
            then: "$$DESCEND",
            else: "$$PRUNE",
          },
        },
      },
    ]);
  });

  test("replaceRoot", async () => {
    const CollectionModel = require("../model/collection");

    await CollectionModel.insertMany([
      { _id: 1, name: { first: "John", last: "Backus" } },
      { _id: 2, name: { first: "John", last: "McCarthy" } },
      { _id: 3, name: { first: "Grace", last: "Hopper" } },
      { _id: 4, firstname: "Ole-Johan", lastname: "Dahl" },
    ]);

    const res = await CollectionModel.aggregate([
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                _id: "$_id",
                first: "",
                last: "",
              },
              "$name",
            ],
          },
        },
      },
    ]);
    //

    const res1 = await CollectionModel.aggregate([
      {
        $match: {
          name: { $exists: true, $not: { $type: "array" }, $type: "object" },
        },
      },
      {
        $replaceRoot: {
          newRoot: "$name",
        },
      },
    ]);
    //
    const res2 = await CollectionModel.aggregate([
      {
        $replaceRoot: {
          newRoot: {
            $ifNull: [
              "$name",
              {
                _id: "$_id",
                missingName: true,
              },
            ],
          },
        },
      },
    ]);
    //
    const ContactModel = require("../model/contact");
    await ContactModel.insertMany([
      { _id: 1, name: "Fred", email: "fred@example.net" },
      { _id: 2, name: "Frank N. Stine", cell: "012-345-9999" },
      {
        _id: 3,
        name: "Gren Dell",
        home: "987-654-3210",
        email: "beo@example.net",
      },
    ]);

    const res3 = await ContactModel.aggregate([
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              { _id: "", name: "", email: "", cell: "", home: "" },
              { test: "test" },
              "$$ROOT",
            ],
          },
        },
      },
    ]);
  });

  test("replaceWith", async () => {
    const SaleReportModel = require("../model/saleReport");

    await SaleReportModel.insertMany([
      { _id: 1, quarter: "2019Q1", region: "A", qty: 400 },
      { _id: 2, quarter: "2019Q1", region: "B", qty: 550 },
      { _id: 3, quarter: "2019Q1", region: "C", qty: 1000 },
      { _id: 4, quarter: "2019Q2", region: "A", qty: 660 },
      { _id: 5, quarter: "2019Q2", region: "B", qty: 500 },
      { _id: 6, quarter: "2019Q2", region: "C", qty: 1200 },
    ]);

    const res = await SaleReportModel.aggregate([
      {
        $addFields: {
          obj: { k: "$region", v: "$qty" },
        },
      },
      {
        $group: {
          _id: "$quarter",
          items: {
            $push: "$obj",
          },
        },
      },
      {
        $project: {
          items2: {
            $concatArrays: [[{ k: "_id", v: "$_id" }], "$items"],
          },
        },
      },
      {
        $replaceWith: {
          $arrayToObject: "$items2",
        },
      },
    ]);
  });

  test("sample", async () => {
    // 随机抽样
    const UserModel = require("../model/user");
    await UserModel.insertMany([
      { _id: 1, name: "dave123", q1: true, q2: true },
      { _id: 2, name: "dave2", q1: false, q2: false },
      { _id: 3, name: "ahn", q1: true, q2: true },
      { _id: 4, name: "li", q1: true, q2: false },
      { _id: 5, name: "annT", q1: false, q2: true },
      { _id: 6, name: "li", q1: true, q2: true },
      { _id: 7, name: "ty", q1: false, q2: true },
    ]);

    const res = await UserModel.aggregate([
      {
        $sample: {
          size: 3,
        },
      },
    ]);
  });

  test("set", async () => {
    const ScoreModel = require("../model/score");

    await ScoreModel.insertMany([
      {
        _id: 1,
        student: "Maya",
        homework: [10, 5, 10],
        quiz: [10, 8],
        extraCredit: 0,
      },
      {
        _id: 2,
        student: "Ryan",
        homework: [5, 6, 5],
        quiz: [8, 8],
        extraCredit: 8,
      },
    ]);

    const res = await ScoreModel.aggregate([
      {
        $match: {
          _id: 1,
        },
      },
      {
        $set: {
          homework: {
            $concatArrays: ["$homework", [7]],
          },
        },
      },
    ]);

    const res1 = await ScoreModel.aggregate([
      {
        $set: {
          quizAverage: {
            $avg: "$quiz",
          },
        },
      },
    ]);
  });

  test("sortByCount", async () => {
    const ExhibitModel = require("../model/exhibit");

    await ExhibitModel.insertMany([
      {
        _id: 1,
        title: "The Pillars of Society",
        artist: "Grosz",
        year: 1926,
        tags: ["painting", "satire", "Expressionism", "caricature"],
      },
      {
        _id: 2,
        title: "Melancholy III",
        artist: "Munch",
        year: 1902,
        tags: ["woodcut", "Expressionism"],
      },
      {
        _id: 3,
        title: "Dancer",
        artist: "Miro",
        year: 1925,
        tags: ["oil", "Surrealism", "painting"],
      },
      {
        _id: 4,
        title: "The Great Wave off Kanagawa",
        artist: "Hokusai",
        tags: ["woodblock", "ukiyo-e"],
      },
      {
        _id: 5,
        title: "The Persistence of Memory",
        artist: "Dali",
        year: 1931,
        tags: ["Surrealism", "painting", "oil"],
      },
      {
        _id: 6,
        title: "Composition VII",
        artist: "Kandinsky",
        year: 1913,
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
        tags: ["abstract", "painting"],
      },
    ]);

    const res = await ExhibitModel.aggregate([
      {
        $unwind: "$tags",
      },
      {
        $sortByCount: "$tags",
      },
    ]);
  });

  test("unionWith", async () => {
    const SupplyModel = require("../model/supply");
    const WarehouseModel = require("../model/warehouse");

    await SupplyModel.insertMany([
      { _id: 1, supplier: "Aardvark and Sons", state: "Texas" },
      { _id: 2, supplier: "Bears Run Amok.", state: "Colorado" },
      { _id: 3, supplier: "Squid Mark Inc. ", state: "Rhode Island" },
    ]);

    await WarehouseModel.insertMany([
      { _id: 1, warehouse: "A", region: "West", state: "California" },
      { _id: 2, warehouse: "B", region: "Central", state: "Colorado" },
      { _id: 3, warehouse: "C", region: "East", state: "Florida" },
    ]);

    const res = await SupplyModel.aggregate([
      {
        $project: {
          _id: 0,
          state: 1,
        },
      },
      {
        $unionWith: {
          coll: WarehouseModel.collection.name,
          pipeline: [
            {
              $project: {
                _id: 0,
                state: 1,
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: "$state",
        },
      },
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

test("text", async () => {
  const ArticleModel = require("../model/article");
  await ArticleModel.insertMany([
    { _id: 1, subject: "coffee", author: "xyz", views: 50 },
    { _id: 2, subject: "Coffee Shopping", author: "efg", views: 5 },
    { _id: 3, subject: "Baking a cake", author: "abc", views: 90 },
    { _id: 4, subject: "baking", author: "xyz", views: 100 },
    { _id: 5, subject: "Café Con Leche", author: "abc", views: 200 },
    { _id: 6, subject: "Сырники", author: "jkl", views: 80 },
    { _id: 7, subject: "coffee and cream", author: "efg", views: 10 },
    { _id: 8, subject: "Cafe con Leche", author: "xyz", views: 10 },
  ]);

  const res = await ArticleModel.find({ $text: { $search: "coffee" } });

  // 以下示例指定由空格分隔的三个搜索词组成的 $search 字符串 "bake coffee cake"
  const res1 = await ArticleModel.find({
    $text: { $search: "bake coffee cake" },
  });

  // 以下示例匹配短语 coffee shop和Cafe con Leche 。这是两个短语的逻辑 OR。
  const res2 = await ArticleModel.find({
    $text: { $search: "'coffee shop' 'Cafe con Leche'" },
  });

  // 以下示例匹配包含单词 coffee 但不包含搜索词 shop 的文档
  const res3 = await ArticleModel.find({
    $text: { $search: "Coffee -shop", $caseSensitive: true },
  });
});

test("meta", async () => {
  const ArticleModel = require("../model/article");

  await ArticleModel.insertMany([
    { _id: 1, title: "cakes and ale" },
    { _id: 2, title: "more cakes" },
    { _id: 3, title: "bread" },
    { _id: 4, title: "some cakes" },
    { _id: 5, title: "two cakes to go" },
    { _id: 6, title: "pie" },
  ]);

  // 返回与每份匹配文档相应的 $text 查询关联的得分。文本得分表示文档与搜索词的匹配程度。 { $meta: "textScore" } 必须与 $text 查询结合使用。
  const res = await ArticleModel.find(
    { $text: { $search: "cake" } },
    { score: { $meta: "textScore" } }
  );
  //

  const OrderModel = require("../model/order");
  await OrderModel.insertMany([
    { item: "abc", price: 12, quantity: 2, type: "apparel" },
    { item: "jkl", price: 23, quantity: 1, type: "electronics" },
    { item: "abc", price: 11, quantity: 5, type: "apparel" },
  ]);

  // err! not work
  // const res1 = await OrderModel.find(
  //   { type: "apparel" },
  //   { idxKey: { $meta: "indexKey" } }
  // );
  const res1 = await OrderModel.aggregate([
    {
      $match: { type: "apparel" },
    },
    {
      $addFields: {
        idx: { $meta: "indexKey" },
      },
    },
  ]);
  //
});

describe("operation", () => {
  test("abs", async () => {
    const TemperatureChangeModel = require("../model/temperatureChange");

    await TemperatureChangeModel.insertMany([
      { _id: 1, startTemp: 50, endTemp: 80 },
      { _id: 2, startTemp: 40, endTemp: 40 },
      { _id: 3, startTemp: 90, endTemp: 70 },
      { _id: 4, startTemp: 60, endTemp: 70 },
    ]);

    const res = await TemperatureChangeModel.aggregate([
      {
        $project: {
          delta: {
            $abs: {
              $subtract: ["$startTemp", "$endTemp"],
            },
          },
        },
      },
    ]);
    console.log("res: ", res);
  });

  test("addToSet", async () => {
    const SaleModel = require("../model/sales");

    await SaleModel.insertMany([
      {
        _id: 1,
        item: "abc",
        price: 10,
        quantity: 2,
        date: new Date("2014-01-01T08:00:00Z"),
      },
      {
        _id: 2,
        item: "jkl",
        price: 20,
        quantity: 1,
        date: new Date("2014-02-03T09:00:00Z"),
      },
      {
        _id: 3,
        item: "xyz",
        price: 5,
        quantity: 5,
        date: new Date("2014-02-03T09:05:00Z"),
      },
      {
        _id: 4,
        item: "abc",
        price: 10,
        quantity: 10,
        date: new Date("2014-02-15T08:00:00Z"),
      },
      {
        _id: 5,
        item: "xyz",
        price: 5,
        quantity: 10,
        date: new Date("2014-02-15T09:12:00Z"),
      },
    ]);

    const res = await SaleModel.aggregate([
      {
        $group: {
          _id: {
            day: {
              $dayOfYear: "$date",
            },
            year: {
              $year: "$date",
            },
          },
          itemSole: {
            $addToSet: "$item",
          },
        },
      },
      // {},
    ]);
    console.log(res);
  });

  test("elementAtIdx", async () => {
    const UserModel = require("../model/user");

    await UserModel.insertMany([
      {
        _id: 1,
        name: "dave123",
        favorites: ["chocolate", "cake", "butter", "apples"],
      },
      { _id: 2, name: "li", favorites: ["apples", "pudding", "pie"] },
      {
        _id: 3,
        name: "ahn",
        favorites: ["pears", "pecans", "chocolate", "cherries"],
      },
      { _id: 4, name: "ty", favorites: ["ice cream"] },
    ]);

    const res = await UserModel.aggregate([
      {
        $project: {
          name: "$name",
          first: { $arrayElemAt: ["$favorites", 0] },
          last: { $arrayElemAt: ["$favorites", -1] }, // 倒数
        },
      },
    ]);
    console.log("res: ", res);
  });

  test("array to object", async () => {
    const InventoryModel = require("../model/inventory");

    // await InventoryModel.insertMany([
    //   {
    //     _id: 1,
    //     item: "ABC1",
    //     dimensions: [
    //       { k: "l", v: 25 },
    //       { k: "w", v: 10 },
    //       { k: "uom", v: "cm" },
    //     ],
    //   },
    //   {
    //     _id: 2,
    //     item: "ABC2",
    //     dimensions: [
    //       ["l", 50],
    //       ["w", 25],
    //       ["uom", "cm"],
    //     ],
    //   },
    //   {
    //     _id: 3,
    //     item: "ABC3",
    //     dimensions: [
    //       ["l", 25],
    //       ["l", "cm"],
    //       ["l", 50],
    //     ],
    //   },
    // ]);

    // const res = await InventoryModel.aggregate([
    //   {
    //     $project: {
    //       dimensions: { $arrayToObject: "$dimensions" },
    //     },
    //   },
    // ]);
    // console.log("res: ", res);

    await InventoryModel.insertMany([
      {
        _id: 100,
        item: "ABC1",
        instock: { warehouse1: 2500, warehouse2: 500 },
      },
      { _id: 200, item: "ABC2", instock: { warehouse2: 500, warehouse3: 200 } },
    ]);

    const res1 = await InventoryModel.aggregate([
      {
        $addFields: {
          instock: {
            $objectToArray: "$instock",
          },
        },
      },
      {
        $addFields: {
          instock: {
            $concatArrays: [
              "$instock",
              [{ k: "total", v: { $sum: "$instock.v" } }], // 此时的instock是一个数组
            ],
          },
        },
      },
      {
        $addFields: {
          instock: {
            $arrayToObject: "$instock",
          },
        },
      },
    ]);
    console.log("res1: ", JSON.stringify(res1));
  });

  test("bottom", async () => {
    const GameScoreModel = require("../model/gamescore");
    await GameScoreModel.insertMany([
      { playerId: "PlayerA", gameId: "G1", score: 31 },
      { playerId: "PlayerB", gameId: "G1", score: 33 },
      { playerId: "PlayerC", gameId: "G1", score: 99 },
      { playerId: "PlayerD", gameId: "G1", score: 1 },
      { playerId: "PlayerA", gameId: "G2", score: 10 },
      { playerId: "PlayerB", gameId: "G2", score: 14 },
      { playerId: "PlayerC", gameId: "G2", score: 66 },
      { playerId: "PlayerD", gameId: "G2", score: 80 },
    ]);

    const res = await GameScoreModel.aggregate([
      {
        $match: {
          gameId: "G1",
        },
      },
      {
        $group: {
          _id: "$gameId",
          score: {
            $bottom: {
              output: ["$playerId", "$score"],
              sortBy: { score: -1 },
            },
          },
        },
      },
    ]);
    console.log("res: ", res);
  });
});
