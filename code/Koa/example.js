const Application = require(".");

const app = new Application();

app.use(async (ctx, next) => {
  console.log("Middleware 1 Start");
  await next();
  console.log("Middleware 1 End");
});

app.use(async (ctx, next) => {
  console.log("Middleware 2 Start");
  await next();
  console.log("Middleware 2 End");

  ctx.body = "hello, world";
});

app.listen(7001, () => {
  console.log("Listing 7001...");
});
