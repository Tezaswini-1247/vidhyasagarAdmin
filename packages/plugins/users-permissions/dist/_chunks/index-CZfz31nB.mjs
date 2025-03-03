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
const name$1 = "@strapi/plugin-users-permissions";
const version = "5.4.2";
const description = "Protect your API with a full-authentication process based on JWT";
const repository = {
  type: "git",
  url: "git://github.com/strapi/strapi.git"
};
const license = "SEE LICENSE IN LICENSE";
const author = {
  name: "Strapi Solutions SAS",
  email: "hi@strapi.io",
  url: "https://strapi.io"
};
const maintainers = [
  {
    name: "Strapi Solutions SAS",
    email: "hi@strapi.io",
    url: "https://strapi.io"
  }
];
const exports = {
  "./strapi-admin": {
    source: "./admin/src/index.js",
    "import": "./dist/admin/index.mjs",
    require: "./dist/admin/index.js",
    "default": "./dist/admin/index.js"
  },
  "./strapi-server": {
    source: "./server/index.js",
    require: "./server/index.js",
    "default": "./server/index.js"
  },
  "./package.json": "./package.json"
};
const scripts = {
  build: "pack-up build",
  clean: "run -T rimraf dist",
  lint: "run -T eslint .",
  "test:front": "run -T cross-env IS_EE=true jest --config ./jest.config.front.js",
  "test:front:ce": "run -T cross-env IS_EE=false jest --config ./jest.config.front.js",
  "test:front:watch": "run -T cross-env IS_EE=true jest --config ./jest.config.front.js --watchAll",
  "test:front:watch:ce": "run -T cross-env IS_EE=false jest --config ./jest.config.front.js --watchAll",
  "test:unit": "run -T jest",
  "test:unit:watch": "run -T jest --watch",
  watch: "pack-up watch"
};
const dependencies = {
  "@strapi/design-system": "2.0.0-rc.14",
  "@strapi/icons": "2.0.0-rc.14",
  "@strapi/utils": "5.4.2",
  bcryptjs: "2.4.3",
  formik: "2.4.5",
  "grant-koa": "5.4.8",
  immer: "9.0.21",
  jsonwebtoken: "9.0.0",
  "jwk-to-pem": "2.0.5",
  koa: "2.15.2",
  "koa2-ratelimit": "^1.1.3",
  lodash: "4.17.21",
  "prop-types": "^15.8.1",
  purest: "4.0.2",
  "react-intl": "6.6.2",
  "react-query": "3.39.3",
  "react-redux": "8.1.3",
  "url-join": "4.0.1",
  yup: "0.32.9"
};
const devDependencies = {
  "@strapi/pack-up": "5.0.2",
  "@strapi/strapi": "5.4.2",
  "@testing-library/dom": "10.1.0",
  "@testing-library/react": "15.0.7",
  "@testing-library/user-event": "14.5.2",
  msw: "1.3.0",
  react: "18.3.1",
  "react-dom": "18.3.1",
  "react-router-dom": "6.22.3",
  "styled-components": "6.1.8"
};
const peerDependencies = {
  "@strapi/strapi": "^5.0.0",
  react: "^17.0.0 || ^18.0.0",
  "react-dom": "^17.0.0 || ^18.0.0",
  "react-router-dom": "^6.0.0",
  "styled-components": "^6.0.0"
};
const engines = {
  node: ">=18.0.0 <=22.x.x",
  npm: ">=6.0.0"
};
const strapi = {
  displayName: "Roles & Permissions",
  name: "users-permissions",
  description: "Protect your API with a full authentication process based on JWT. This plugin comes also with an ACL strategy that allows you to manage the permissions between the groups of users.",
  required: true,
  kind: "plugin"
};
const gitHead = "7d785703f52464577d077c4618cbe68b44f8a9cd";
const pluginPkg = {
  name: name$1,
  version,
  description,
  repository,
  license,
  author,
  maintainers,
  exports,
  scripts,
  dependencies,
  devDependencies,
  peerDependencies,
  engines,
  strapi,
  gitHead
};
const PERMISSIONS = {
  // Roles
  accessRoles: [
    { action: "plugin::users-permissions.roles.create", subject: null },
    { action: "plugin::users-permissions.roles.read", subject: null }
  ],
  createRole: [{ action: "plugin::users-permissions.roles.create", subject: null }],
  deleteRole: [{ action: "plugin::users-permissions.roles.delete", subject: null }],
  readRoles: [{ action: "plugin::users-permissions.roles.read", subject: null }],
  updateRole: [{ action: "plugin::users-permissions.roles.update", subject: null }],
  // AdvancedSettings
  readAdvancedSettings: [
    { action: "plugin::users-permissions.advanced-settings.read", subject: null }
  ],
  updateAdvancedSettings: [
    { action: "plugin::users-permissions.advanced-settings.update", subject: null }
  ],
  // Emails
  readEmailTemplates: [{ action: "plugin::users-permissions.email-templates.read", subject: null }],
  updateEmailTemplates: [
    { action: "plugin::users-permissions.email-templates.update", subject: null }
  ],
  // Providers
  readProviders: [{ action: "plugin::users-permissions.providers.read", subject: null }],
  updateProviders: [{ action: "plugin::users-permissions.providers.update", subject: null }]
};
const pluginId = pluginPkg.name.replace(/^@strapi\/plugin-/i, "");
const getTrad = (id) => `${pluginId}.${id}`;
const prefixPluginTranslations = (trad, pluginId2) => {
  return Object.keys(trad).reduce((acc, current) => {
    acc[`${pluginId2}.${current}`] = trad[current];
    return acc;
  }, {});
};
const name = pluginPkg.strapi.name;
const index = {
  register(app) {
    app.createSettingSection(
      {
        id: "users-permissions",
        intlLabel: {
          id: getTrad("Settings.section-label"),
          defaultMessage: "Users & Permissions plugin"
        }
      },
      [
        {
          intlLabel: {
            id: "global.roles",
            defaultMessage: "Roles"
          },
          id: "roles",
          to: `users-permissions/roles`,
          Component: () => import("./index-BxRr_Q8e.mjs"),
          permissions: PERMISSIONS.accessRoles
        },
        {
          intlLabel: {
            id: getTrad("HeaderNav.link.providers"),
            defaultMessage: "Providers"
          },
          id: "providers",
          to: `users-permissions/providers`,
          Component: () => import("./index-b4-Dr3a_.mjs"),
          permissions: PERMISSIONS.readProviders
        },
        {
          intlLabel: {
            id: getTrad("HeaderNav.link.emailTemplates"),
            defaultMessage: "Email templates"
          },
          id: "email-templates",
          to: `users-permissions/email-templates`,
          Component: () => import("./index-BxTiLsrA.mjs").then((mod) => ({
            default: mod.ProtectedEmailTemplatesPage
          })),
          permissions: PERMISSIONS.readEmailTemplates
        },
        {
          intlLabel: {
            id: getTrad("HeaderNav.link.advancedSettings"),
            defaultMessage: "Advanced Settings"
          },
          id: "advanced-settings",
          to: `users-permissions/advanced-settings`,
          Component: () => import("./index-Czn7kpRq.mjs").then((mod) => ({
            default: mod.ProtectedAdvancedSettingsPage
          })),
          permissions: PERMISSIONS.readAdvancedSettings
        }
      ]
    );
    app.registerPlugin({
      id: "users-permissions",
      name
    });
  },
  bootstrap() {
  },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/ar.json": () => import("./ar-CK8BRRXB.mjs"), "./translations/cs.json": () => import("./cs-BVigMk0l.mjs"), "./translations/de.json": () => import("./de-BKUdRFI4.mjs"), "./translations/dk.json": () => import("./dk-BQiTK50l.mjs"), "./translations/en.json": () => import("./en-DOHtPf-2.mjs"), "./translations/es.json": () => import("./es-DNgOVMjD.mjs"), "./translations/fr.json": () => import("./fr-DkgRugiU.mjs"), "./translations/id.json": () => import("./id-BdEsvnaF.mjs"), "./translations/it.json": () => import("./it-B-rv0E24.mjs"), "./translations/ja.json": () => import("./ja-C8K-VBPD.mjs"), "./translations/ko.json": () => import("./ko-Busb0wIY.mjs"), "./translations/ms.json": () => import("./ms-ByvsQjRt.mjs"), "./translations/nl.json": () => import("./nl-5qO8Rpcy.mjs"), "./translations/pl.json": () => import("./pl-BdIzifBE.mjs"), "./translations/pt-BR.json": () => import("./pt-BR-f0p23AQZ.mjs"), "./translations/pt.json": () => import("./pt-BIO24ioG.mjs"), "./translations/ru.json": () => import("./ru-VWy-IB7K.mjs"), "./translations/sk.json": () => import("./sk-B_LIcepm.mjs"), "./translations/sv.json": () => import("./sv-ABLKOokl.mjs"), "./translations/th.json": () => import("./th-DKyP7ueR.mjs"), "./translations/tr.json": () => import("./tr-qa1Q5UjC.mjs"), "./translations/uk.json": () => import("./uk-BmRqbeQc.mjs"), "./translations/vi.json": () => import("./vi-HW-EdMea.mjs"), "./translations/zh-Hans.json": () => import("./zh-Hans-BHilK-yc.mjs"), "./translations/zh.json": () => import("./zh-5hKkVPA4.mjs") }), `./translations/${locale}.json`, 3).then(({ default: data }) => {
          return {
            data: prefixPluginTranslations(data, "users-permissions"),
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
  getTrad as g,
  index as i
};
//# sourceMappingURL=index-CZfz31nB.mjs.map
