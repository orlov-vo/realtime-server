import { APP_PRIVATE_TOKEN, PORT } from "./config.ts";
import { Application, Context, Router, Status } from "./deps.ts";

const app = new Application();
const router = new Router();

const features = new BroadcastChannel("features");

router.post("/private/features", async (ctx: Context) => {
  const accessToken = ctx.request.url.searchParams.get("access_token");
  ctx.assert(accessToken === APP_PRIVATE_TOKEN, Status.Forbidden);

  const json = await ctx.request.body({ type: "json" }).value;
  features.postMessage(json);
});

router.get("/extension/features", (ctx) => {
  ctx.request.accepts("text/event-stream");

  const target = ctx.sendEvents();
  const handleMessage = (event: MessageEvent) => {
    target.dispatchMessage(event.data);
  };

  features.addEventListener("message", handleMessage);
  target.addEventListener("close", () => {
    features.removeEventListener("message", handleMessage);
  });
});

app.use(router.allowedMethods(), router.routes());
await app.listen({ port: PORT });
