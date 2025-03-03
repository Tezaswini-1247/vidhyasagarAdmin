"use strict";
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
const exports$1 = {
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
  exports: exports$1,
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
          Component: () => Promise.resolve().then(() => require("./index-DE9YF9iS.js")),
          permissions: PERMISSIONS.accessRoles
        },
        {
          intlLabel: {
            id: getTrad("HeaderNav.link.providers"),
            defaultMessage: "Providers"
          },
          id: "providers",
          to: `users-permissions/providers`,
          Component: () => Promise.resolve().then(() => require("./index-BugQWIUb.js")),
          permissions: PERMISSIONS.readProviders
        },
        {
          intlLabel: {
            id: getTrad("HeaderNav.link.emailTemplates"),
            defaultMessage: "Email templates"
          },
          id: "email-templates",
          to: `users-permissions/email-templates`,
          Component: () => Promise.resolve().then(() => require("./index-Cd_lvUz1.js")).then((mod) => ({
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
          Component: () => Promise.resolve().then(() => require("./index-B6hAkF8-.js")).then((mod) => ({
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
        return __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/ar.json": () => Promise.resolve().then(() => require("./ar-BguGUqwK.js")), "./translations/cs.json": () => Promise.resolve().then(() => require("./cs-BW8-K_GY.js")), "./translations/de.json": () => Promise.resolve().then(() => require("./de-owXpVluI.js")), "./translations/dk.json": () => Promise.resolve().then(() => require("./dk-LXAnbuBk.js")), "./translations/en.json": () => Promise.resolve().then(() => require("./en-MHo5mcsU.js")), "./translations/es.json": () => Promise.resolve().then(() => require("./es-BwLCLXAQ.js")), "./translations/fr.json": () => Promise.resolve().then(() => require("./fr-DkhpSjjm.js")), "./translations/id.json": () => Promise.resolve().then(() => require("./id-BTemOeTZ.js")), "./translations/it.json": () => Promise.resolve().then(() => require("./it-D1rH6V6_.js")), "./translations/ja.json": () => Promise.resolve().then(() => require("./ja-DqShgTMf.js")), "./translations/ko.json": () => Promise.resolve().then(() => require("./ko-B9DGEPWH.js")), "./translations/ms.json": () => Promise.resolve().then(() => require("./ms-CPBU3LWf.js")), "./translations/nl.json": () => Promise.resolve().then(() => require("./nl-CwNB6YoO.js")), "./translations/pl.json": () => Promise.resolve().then(() => require("./pl-Do9UD69f.js")), "./translations/pt-BR.json": () => Promise.resolve().then(() => require("./pt-BR-D7dZhxuP.js")), "./translations/pt.json": () => Promise.resolve().then(() => require("./pt-fdvyOnUp.js")), "./translations/ru.json": () => Promise.resolve().then(() => require("./ru-C94rjPGA.js")), "./translations/sk.json": () => Promise.resolve().then(() => require("./sk-BABEhykl.js")), "./translations/sv.json": () => Promise.resolve().then(() => require("./sv-Be43LhA9.js")), "./translations/th.json": () => Promise.resolve().then(() => require("./th-DgVhVLhL.js")), "./translations/tr.json": () => Promise.resolve().then(() => require("./tr-B_idhkEs.js")), "./translations/uk.json": () => Promise.resolve().then(() => require("./uk-LHOivnhP.js")), "./translations/vi.json": () => Promise.resolve().then(() => require("./vi-CdVRdKDw.js")), "./translations/zh-Hans.json": () => Promise.resolve().then(() => require("./zh-Hans-GQDMKtY4.js")), "./translations/zh.json": () => Promise.resolve().then(() => require("./zh-Cuq8gMnF.js")) }), `./translations/${locale}.json`, 3).then(({ default: data }) => {
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
exports.PERMISSIONS = PERMISSIONS;
exports.getTrad = getTrad;
exports.index = index;
//# sourceMappingURL=index-Cr_zjDRa.js.map
