export default ({ env }) => ({
  host: env('HOST', '127.0.0.1'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', 'https://admin.bywharf.com'),
  proxy: { koa: true },
  app: { keys: env.array('APP_KEYS') },
});
