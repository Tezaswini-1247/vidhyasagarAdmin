import { Information } from "@strapi/icons";
const __variableDynamicImportRuntimeHelper = (glob, path, segs) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(
      reject.bind(
        null,
        new Error(
          "Unknown variable dynamic import: " + path + (path.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : "")
        )
      )
    );
  });
};
const PERMISSIONS = {
  // This permission regards the main component (App) and is used to tell
  // If the plugin link should be displayed in the menu
  // And also if the plugin is accessible. This use case is found when a user types the url of the
  // plugin directly in the browser
  main: [
    { action: "plugin::documentation.read", subject: null },
    { action: "plugin::documentation.settings.regenerate", subject: null },
    { action: "plugin::documentation.settings.update", subject: null }
  ],
  open: [
    { action: "plugin::documentation.read", subject: null },
    { action: "plugin::documentation.settings.regenerate", subject: null }
  ],
  regenerate: [{ action: "plugin::documentation.settings.regenerate", subject: null }],
  update: [{ action: "plugin::documentation.settings.update", subject: null }]
};
const pluginId = "documentation";
const prefixPluginTranslations = (trad, pluginId2) => {
  return Object.keys(trad).reduce(
    (acc, current) => {
      acc[`${pluginId2}.${current}`] = trad[current];
      return acc;
    },
    {}
  );
};
const index = {
  register(app) {
    app.addMenuLink({
      to: `plugins/${pluginId}`,
      icon: Information,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: "Documentation"
      },
      permissions: PERMISSIONS.main,
      Component: async () => {
        const { App } = await import("./App-D3sYdNAh.mjs");
        return App;
      },
      position: 9
    });
    app.registerPlugin({
      id: pluginId,
      name: pluginId
    });
  },
  bootstrap(app) {
    app.addSettingsLink("global", {
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: "Documentation"
      },
      id: "documentation",
      to: pluginId,
      Component: async () => {
        const { SettingsPage } = await import("./Settings-DiK51xGj.mjs");
        return SettingsPage;
      },
      permissions: PERMISSIONS.main
    });
  },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/ar.json": () => import("./ar-ckp9T43y.mjs"), "./translations/cs.json": () => import("./cs-ciLYCxgd.mjs"), "./translations/de.json": () => import("./de-DqkAUMvP.mjs"), "./translations/dk.json": () => import("./dk-DgCq8mF-.mjs"), "./translations/en.json": () => import("./en-BQ_E53_2.mjs"), "./translations/es.json": () => import("./es-CEiXVnsb.mjs"), "./translations/fr.json": () => import("./fr-BlX-v4UF.mjs"), "./translations/id.json": () => import("./id-CPOl6_EU.mjs"), "./translations/it.json": () => import("./it-DWJI563z.mjs"), "./translations/ko.json": () => import("./ko-CFzSHayG.mjs"), "./translations/ms.json": () => import("./ms-CUgPFo4U.mjs"), "./translations/nl.json": () => import("./nl-B_7CHwVD.mjs"), "./translations/pl.json": () => import("./pl-DwLr8sw9.mjs"), "./translations/pt-BR.json": () => import("./pt-BR-MVXc6V9P.mjs"), "./translations/pt.json": () => import("./pt-C2N9fdeh.mjs"), "./translations/ru.json": () => import("./ru-BddeNlU0.mjs"), "./translations/sk.json": () => import("./sk-BmT4uZTG.mjs"), "./translations/sv.json": () => import("./sv-D_-KBtcw.mjs"), "./translations/th.json": () => import("./th-DkuoSGii.mjs"), "./translations/tr.json": () => import("./tr-l-xxK4Yk.mjs"), "./translations/uk.json": () => import("./uk-Cpmsxyku.mjs"), "./translations/vi.json": () => import("./vi-ClWGrFm9.mjs"), "./translations/zh-Hans.json": () => import("./zh-Hans-XLMwjASk.mjs"), "./translations/zh.json": () => import("./zh-Glkg1L2g.mjs") }), `./translations/${locale}.json`, 3).then(({ default: data }) => {
          return {
            data: prefixPluginTranslations(data, pluginId),
            locale
          };
        }).catch(() => {
          return {
            data: {},
            locale
          };
        });
      })
    );
    return Promise.resolve(importedTrads);
  }
};
export {
  PERMISSIONS as P,
  index as i,
  pluginId as p
};
