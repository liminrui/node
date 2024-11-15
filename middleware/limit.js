const RateLimiter = require("async-ratelimiter");
const { getClientIp } = require("request-ip");
const client = require("../utils/redis");

const rateLimiter = new RateLimiter({
  db: client,
});

const apiQuota = async (ctx, next) => {
  const clientIp = getClientIp(ctx.req);

  const limit = await rateLimiter.get({ id: clientIp, max: 20 });

  if (!ctx.res.writableEnded) {
    ctx.res.setHeader("X-Rate-Limit-Limit", limit.total);
    ctx.res.setHeader(
      "X-Rate-Limit-Remaining",
      Math.max(0, limit.remaining - 1)
    );
    ctx.res.setHeader("X-Rate-Limit-Reset", limit.reset);
  }

  return !limit.remaining ? (ctx.body = "out of limit") : next();
};

module.exports = apiQuota;
