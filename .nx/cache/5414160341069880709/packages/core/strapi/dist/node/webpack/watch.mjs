import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import { webpack } from "webpack";
import { resolveDevelopmentConfig, mergeConfigWithUserConfig } from "./config.mjs";
const watch = async (ctx) => {
  const config = await resolveDevelopmentConfig(ctx);
  const finalConfig = await mergeConfigWithUserConfig(config, ctx);
  ctx.logger.debug("Final webpack config:", os.EOL, finalConfig);
  return new Promise((res) => {
    const compiler = webpack(finalConfig);
    const devMiddleware = webpackDevMiddleware(compiler);
    const hotMiddleware = webpackHotMiddleware(compiler, {
      log: false,
      path: "/__webpack_hmr"
    });
    ctx.strapi.server.app.use((ctx2, next) => {
      return new Promise((resolve, reject) => {
        hotMiddleware(ctx2.req, ctx2.res, (err) => {
          if (err) reject(err);
          else resolve(next());
        });
      });
    });
    ctx.strapi.server.app.use((context, next) => {
      const ready = new Promise((resolve) => {
        devMiddleware.waitUntilValid(() => {
          resolve(true);
        });
      });
      const init = new Promise((resolve) => {
        devMiddleware(
          context.req,
          {
            // @ts-expect-error ignored
            end(content) {
              context.body = content;
              resolve(true);
            },
            getHeader: context.get.bind(context),
            // @ts-expect-error ignored
            setHeader: context.set.bind(context),
            locals: context.state
          },
          () => resolve(next())
        );
      });
      return Promise.all([ready, init]);
    });
    const serveAdmin = async (ctx2, next) => {
      await next();
      if (devMiddleware.context.outputFileSystem.createReadStream) {
        if (ctx2.method !== "HEAD" && ctx2.method !== "GET") {
          return;
        }
        if (ctx2.body != null || ctx2.status !== 404) {
          return;
        }
        const filename = path.resolve(finalConfig.output?.path, "index.html");
        ctx2.type = "html";
        ctx2.body = devMiddleware.context.outputFileSystem.createReadStream(filename);
      }
    };
    ctx.strapi.server.routes([
      {
        method: "GET",
        path: `${ctx.basePath}:path*`,
        handler: serveAdmin,
        config: { auth: false }
      }
    ]);
    devMiddleware.waitUntilValid(() => {
      res({
        async close() {
          await Promise.all([
            promisify(devMiddleware.close.bind(devMiddleware))(),
            hotMiddleware.close(),
            promisify(compiler.close.bind(compiler))()
          ]);
        }
      });
    });
  });
};
export {
  watch
};
//# sourceMappingURL=watch.mjs.map
