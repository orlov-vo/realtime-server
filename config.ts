export const PORT = parseInt(Deno.env.get("PORT") ?? "", 10) || 8080;
export const APP_PRIVATE_TOKEN = Deno.env.get("APP_PRIVATE_TOKEN") ?? "secret";
