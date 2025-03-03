import path from "node:path";
import http from "node:http";
import fs from "node:fs/promises";
import { resolveDevelopmentConfig, mergeConfigWithUserConfig } from "./config.mjs";
const HMR_DEFAULT_PORT = 5173;
const createHMRServer = () => {
  return http.createServer(
    // http server request handler. keeps the same with
    // https://github.com/websockets/ws/blob/45e17acea791d865df6b255a55182e9c42e5877a/lib/websocket-server.js#L88-L96
    (_, res) => {
      const body = http.STATUS_CODES[426];
      res.writeHead(426, {
        "Content-Length": body?.length ?? 0,
        "Content-Type": "text/plain"
      });
      res.end(body);
    }
  );
};
const watch = async (ctx) => {
  const hmrServer = createHMRServer();
  ctx.options.hmrServer = hmrServer;
  ctx.options.hmrClientPort = HMR_DEFAULT_PORT;
  const config = await resolveDevelopmentConfig(ctx);
  const finalConfig = await mergeConfigWithUserConfig(config, ctx);
  const hmrConfig = config.server?.hmr;
  if (typeof hmrConfig === "object" && hmrConfig.server === hmrServer) {
    strapi.server.httpServer.on("listening", async () => {
      hmrServer.listen(hmrConfig.clientPort ?? hmrConfig.port ?? HMR_DEFAULT_PORT);
    });
  }
  ctx.logger.debug("Vite config", finalConfig);
  const { createServer } = await import("vite");
  const vite = await createServer(finalConfig);
  ctx.strapi.server.app.use((ctx2, next) => {
    return new Promise((resolve, reject) => {
      vite.middlewares(ctx2.req, ctx2.res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(next());
        }
      });
    });
  });
  const serveAdmin = async (koaCtx, next) => {
    await next();
    if (koaCtx.method !== "HEAD" && koaCtx.method !== "GET") {
      return;
    }
    if (koaCtx.body != null || koaCtx.status !== 404) {
      return;
    }
    const url = koaCtx.originalUrl;
    let template = await fs.readFile(path.relative(ctx.cwd, ".strapi/client/index.html"), "utf-8");
    template = await vite.transformIndexHtml(url, template);
    koaCtx.type = "html";
    koaCtx.body = template;
  };
  ctx.strapi.server.routes([
    {
      method: "GET",
      path: `${ctx.basePath}:path*`,
      handler: serveAdmin,
      config: { auth: false }
    }
  ]);
  return {
    async close() {
      await vite.close();
      if (hmrServer.listening) {
        await new Promise((resolve, reject) => {
          hmrServer.close((err) => err ? reject(err) : resolve());
        });
      }
    }
  };
};
export {
  watch
};
//# sourceMappingURL=watch.mjs.map
