import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import { Flex, Typography, Box, Portal, FocusTrap, IconButton, Button, LinkButton, VisuallyHidden, Badge, Tooltip, AccessibleIcon, Menu, Avatar, useCollator, Divider, Popover, SkipToContent } from '@strapi/design-system';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useIntl } from 'react-intl';
import { NavLink as NavLink$1, useNavigate, useLocation, Outlet } from 'react-router-dom';
import lt from 'semver/functions/lt';
import valid from 'semver/functions/valid';
import { Check, Cross, ArrowRight, SignOut, Lightning, Play, Message, Book, PaperPlane, House, ShoppingCart, Cog } from '@strapi/icons';
import get from 'lodash/get';
import { styled } from 'styled-components';
import { m as useGuidedTour, c as useTracking, r as useConfiguration, u as useAuth, p as useAppInfo, q as useStrapiApp, P as Page, b as useTypedSelector, A as AppInfoProvider } from './Theme-DQRUlj-X.mjs';
import { g as getDisplayName, h as hashAdminUserEmail } from './users-8N93LH7R.mjs';
import { N as NpsSurvey } from './index-DdAmwxFa.mjs';
import { produce } from 'immer';
import set from 'lodash/set';
import { P as PrivateRoute } from './PrivateRoute-DWxFhes2.mjs';
import cloneDeep from 'lodash/cloneDeep';
import { u as useOnce } from './useOnce-NHeEacbN.mjs';
import { d as useInformationQuery } from './admin-CuE4OEl1.mjs';

const name = "@strapi/admin";
const version = "5.4.2";
const description = "Strapi Admin";
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
		types: "./dist/admin/src/index.d.ts",
		source: "./admin/src/index.ts",
		"import": "./dist/admin/index.mjs",
		require: "./dist/admin/index.js",
		"default": "./dist/admin/index.js"
	},
	"./strapi-admin/ee": {
		types: "./dist/admin/src/ee.d.ts",
		source: "./admin/src/ee.ts",
		"import": "./dist/admin/ee.mjs",
		require: "./dist/admin/ee.js",
		"default": "./dist/admin/ee.js"
	},
	"./strapi-admin/test": {
		types: "./dist/admin/tests/index.d.ts",
		source: "./admin/tests/index.ts",
		"import": "./dist/admin/test.mjs",
		require: "./dist/admin/test.js",
		"default": "./dist/admin/test.js"
	},
	"./_internal": {
		types: "./dist/_internal/index.d.ts",
		source: "./_internal/index.ts",
		"import": "./dist/_internal.mjs",
		require: "./dist/_internal.js",
		"default": "./dist/_internal.js"
	},
	"./strapi-server": {
		types: "./dist/server/src/index.d.ts",
		source: "./server/src/index.js",
		"import": "./dist/server/index.mjs",
		require: "./dist/server/index.js",
		"default": "./dist/server/index.js"
	},
	"./package.json": "./package.json"
};
const files = [
	"dist/",
	"strapi-server.js"
];
const scripts = {
	build: "pack-up build && vite build",
	clean: "run -T rimraf ./dist",
	lint: "run -T eslint .",
	"test:front": "run -T cross-env IS_EE=true jest --config ./jest.config.front.js",
	"test:front:watch": "run -T cross-env IS_EE=true jest --config ./jest.config.front.js --watchAll",
	"test:ts": "run -T tsc -p tsconfig.json",
	"test:ts:back": "run -T tsc --noEmit -p server/tsconfig.json",
	"test:ts:front": "run -T tsc -p admin/tsconfig.json && run -T tsc -p ee/admin/tsconfig.json",
	"test:unit": "run -T jest",
	"test:unit:watch": "run -T jest --watch",
	watch: "pack-up watch"
};
const dependencies = {
	"@casl/ability": "6.5.0",
	"@internationalized/date": "3.5.4",
	"@radix-ui/react-context": "1.0.1",
	"@radix-ui/react-toolbar": "1.0.4",
	"@reduxjs/toolkit": "1.9.7",
	"@strapi/design-system": "2.0.0-rc.14",
	"@strapi/icons": "2.0.0-rc.14",
	"@strapi/permissions": "5.4.2",
	"@strapi/types": "5.4.2",
	"@strapi/typescript-utils": "5.4.2",
	"@strapi/utils": "5.4.2",
	"@testing-library/dom": "10.1.0",
	"@testing-library/react": "15.0.7",
	"@testing-library/user-event": "14.5.2",
	axios: "1.7.4",
	bcryptjs: "2.4.3",
	boxen: "5.1.2",
	chalk: "^4.1.2",
	codemirror5: "npm:codemirror@^5.65.11",
	"cross-env": "^7.0.3",
	"date-fns": "2.30.0",
	execa: "5.1.1",
	"fast-deep-equal": "3.1.3",
	formik: "2.4.5",
	"fractional-indexing": "3.2.0",
	"fs-extra": "11.2.0",
	"highlight.js": "^10.4.1",
	immer: "9.0.21",
	inquirer: "8.2.5",
	invariant: "^2.2.4",
	"is-localhost-ip": "2.0.0",
	jsonwebtoken: "9.0.0",
	koa: "2.15.2",
	"koa-compose": "4.1.0",
	"koa-passport": "6.0.0",
	"koa-static": "5.0.0",
	"koa2-ratelimit": "^1.1.3",
	lodash: "4.17.21",
	"node-schedule": "2.1.1",
	ora: "5.4.1",
	"p-map": "4.0.0",
	"passport-local": "1.0.0",
	pluralize: "8.0.0",
	punycode: "2.3.1",
	qs: "6.11.1",
	"react-dnd": "16.0.1",
	"react-dnd-html5-backend": "16.0.1",
	"react-intl": "6.6.2",
	"react-is": "^18.2.0",
	"react-query": "3.39.3",
	"react-redux": "8.1.3",
	"react-select": "5.8.0",
	"react-window": "1.8.10",
	rimraf: "5.0.5",
	"sanitize-html": "2.13.0",
	scheduler: "0.23.0",
	semver: "7.5.4",
	sift: "16.0.1",
	typescript: "5.3.2",
	"use-context-selector": "1.4.1",
	yup: "0.32.9",
	zod: "^3.22.4"
};
const devDependencies = {
	"@strapi/admin-test-utils": "5.4.2",
	"@strapi/data-transfer": "5.4.2",
	"@strapi/pack-up": "5.0.2",
	"@types/codemirror5": "npm:@types/codemirror@^5.60.15",
	"@types/fs-extra": "11.0.4",
	"@types/invariant": "2.2.36",
	"@types/jsonwebtoken": "9.0.3",
	"@types/koa-passport": "6.0.1",
	"@types/lodash": "^4.14.191",
	"@types/markdown-it": "13.0.7",
	"@types/markdown-it-container": "2.0.9",
	"@types/markdown-it-emoji": "2.0.4",
	"@types/markdown-it-footnote": "3.0.3",
	"@types/passport-local": "1.0.36",
	"@types/pluralize": "0.0.32",
	"@types/punycode": "2.1.4",
	"@types/react-window": "1.8.8",
	"@types/sanitize-html": "2.13.0",
	"@vitejs/plugin-react-swc": "3.6.0",
	"koa-body": "6.0.1",
	msw: "1.3.0",
	react: "18.3.1",
	"react-dom": "18.3.1",
	"react-router-dom": "6.22.3",
	"styled-components": "6.1.8",
	vite: "5.2.14",
	"vite-plugin-dts": "^4.3.0"
};
const peerDependencies = {
	"@strapi/data-transfer": "^5.0.0",
	react: "^17.0.0 || ^18.0.0",
	"react-dom": "^17.0.0 || ^18.0.0",
	"react-router-dom": "^6.0.0",
	"styled-components": "^6.0.0"
};
const engines = {
	node: ">=18.0.0 <=22.x.x",
	npm: ">=6.0.0"
};
const nx = {
	targets: {
		build: {
			outputs: [
				"{projectRoot}/build"
			]
		}
	}
};
const gitHead = "7d785703f52464577d077c4618cbe68b44f8a9cd";
const packageJSON = {
	name: name,
	version: version,
	description: description,
	repository: repository,
	license: license,
	author: author,
	maintainers: maintainers,
	exports: exports,
	files: files,
	scripts: scripts,
	dependencies: dependencies,
	devDependencies: devDependencies,
	peerDependencies: peerDependencies,
	engines: engines,
	nx: nx,
	gitHead: gitHead
};

const LAYOUT_DATA = {
  contentTypeBuilder: {
    home: {
      title: {
        id: "app.components.GuidedTour.home.CTB.title",
        defaultMessage: "🧠 Build the content structure"
      },
      cta: {
        title: {
          id: "app.components.GuidedTour.home.CTB.cta.title",
          defaultMessage: "Go to the Content type Builder"
        },
        type: "REDIRECT",
        target: "/plugins/content-type-builder"
      },
      trackingEvent: "didClickGuidedTourHomepageContentTypeBuilder"
    },
    create: {
      title: {
        id: "app.components.GuidedTour.CTB.create.title",
        defaultMessage: "🧠 Create a first Collection type"
      },
      content: {
        id: "app.components.GuidedTour.CTB.create.content",
        defaultMessage: "<p>Collection types help you manage several entries, Single types are suitable to manage only one entry.</p> <p>Ex: For a Blog website, Articles would be a Collection type whereas a Homepage would be a Single type.</p>"
      },
      cta: {
        title: {
          id: "app.components.GuidedTour.CTB.create.cta.title",
          defaultMessage: "Build a Collection type"
        },
        type: "CLOSE"
      },
      trackingEvent: "didClickGuidedTourStep1CollectionType"
    },
    success: {
      title: {
        id: "app.components.GuidedTour.CTB.success.title",
        defaultMessage: "Step 1: Completed ✅"
      },
      content: {
        id: "app.components.GuidedTour.CTB.success.content",
        defaultMessage: "<p>Good going!</p><b>⚡️ What would you like to share with the world?</b>"
      },
      cta: {
        title: {
          id: "app.components.GuidedTour.create-content",
          defaultMessage: "Create content"
        },
        type: "REDIRECT",
        target: "/content-manager"
      },
      trackingEvent: "didCreateGuidedTourCollectionType"
    }
  },
  contentManager: {
    home: {
      title: {
        id: "app.components.GuidedTour.home.CM.title",
        defaultMessage: "⚡️ What would you like to share with the world?"
      },
      cta: {
        title: {
          id: "app.components.GuidedTour.create-content",
          defaultMessage: "Create content"
        },
        type: "REDIRECT",
        target: "/content-manager"
      },
      trackingEvent: "didClickGuidedTourHomepageContentManager"
    },
    create: {
      title: {
        id: "app.components.GuidedTour.CM.create.title",
        defaultMessage: "⚡️ Create content"
      },
      content: {
        id: "app.components.GuidedTour.CM.create.content",
        defaultMessage: "<p>Create and manage all the content here in the Content Manager.</p><p>Ex: Taking the Blog website example further, one can write an Article, save and publish it as they like.</p><p>💡 Quick tip - Don't forget to hit publish on the content you create.</p>"
      },
      cta: {
        title: {
          id: "app.components.GuidedTour.create-content",
          defaultMessage: "Create content"
        },
        type: "CLOSE"
      },
      trackingEvent: "didClickGuidedTourStep2ContentManager"
    },
    success: {
      title: {
        id: "app.components.GuidedTour.CM.success.title",
        defaultMessage: "Step 2: Completed ✅"
      },
      content: {
        id: "app.components.GuidedTour.CM.success.content",
        defaultMessage: "<p>Awesome, one last step to go!</p><b>🚀  See content in action</b>"
      },
      cta: {
        title: {
          id: "app.components.GuidedTour.CM.success.cta.title",
          defaultMessage: "Test the API"
        },
        type: "REDIRECT",
        target: "/settings/api-tokens"
      },
      trackingEvent: "didCreateGuidedTourEntry"
    }
  },
  apiTokens: {
    home: {
      title: {
        id: "app.components.GuidedTour.apiTokens.create.title",
        defaultMessage: "🚀 See content in action"
      },
      cta: {
        title: {
          id: "app.components.GuidedTour.home.apiTokens.cta.title",
          defaultMessage: "Test the API"
        },
        type: "REDIRECT",
        target: "/settings/api-tokens"
      },
      trackingEvent: "didClickGuidedTourHomepageApiTokens"
    },
    create: {
      title: {
        id: "app.components.GuidedTour.apiTokens.create.title",
        defaultMessage: "🚀 See content in action"
      },
      content: {
        id: "app.components.GuidedTour.apiTokens.create.content",
        defaultMessage: "<p>Generate an authentication token here and retrieve the content you just created.</p>"
      },
      cta: {
        title: {
          id: "app.components.GuidedTour.apiTokens.create.cta.title",
          defaultMessage: "Generate an API Token"
        },
        type: "CLOSE"
      },
      trackingEvent: "didClickGuidedTourStep3ApiTokens"
    },
    success: {
      title: {
        id: "app.components.GuidedTour.apiTokens.success.title",
        defaultMessage: "Step 3: Completed ✅"
      },
      content: {
        id: "app.components.GuidedTour.apiTokens.success.content",
        defaultMessage: "<p>See content in action by making an HTTP request:</p><ul><li><p>To this URL: <light>https://'<'YOUR_DOMAIN'>'/api/'<'YOUR_CT'>'</light></p></li><li><p>With the header: <light>Authorization: bearer '<'YOUR_API_TOKEN'>'</light></p></li></ul><p>For more ways to interact with content, see the <documentationLink>documentation</documentationLink>.</p>"
      },
      trackingEvent: "didGenerateGuidedTourApiTokens"
    }
  }
};
const STATES = {
  IS_DONE: "IS_DONE",
  IS_ACTIVE: "IS_ACTIVE",
  IS_NOT_DONE: "IS_NOT_DONE"
};

const Number$1 = ({ children, state, ...props }) => {
  return state === STATES.IS_DONE || state === STATES.IS_ACTIVE ? /* @__PURE__ */ jsx(
    Flex,
    {
      background: "primary600",
      padding: 2,
      borderRadius: "50%",
      width: `3rem`,
      height: `3rem`,
      justifyContent: "center",
      ...props,
      children: state === STATES.IS_DONE ? /* @__PURE__ */ jsx(Check, { "aria-hidden": true, width: `1.6rem`, fill: "neutral0" }) : /* @__PURE__ */ jsx(Typography, { fontWeight: "semiBold", textColor: "neutral0", children })
    }
  ) : /* @__PURE__ */ jsx(
    Flex,
    {
      borderColor: "neutral500",
      borderWidth: "1px",
      borderStyle: "solid",
      padding: 2,
      borderRadius: "50%",
      width: `3rem`,
      height: `3rem`,
      justifyContent: "center",
      ...props,
      children: /* @__PURE__ */ jsx(Typography, { fontWeight: "semiBold", textColor: "neutral600", children })
    }
  );
};
const VerticalDivider = ({ state, ...props }) => /* @__PURE__ */ jsx(
  Box,
  {
    width: `0.2rem`,
    height: "100%",
    background: state === STATES.IS_NOT_DONE ? "neutral300" : "primary500",
    hasRadius: true,
    minHeight: state === STATES.IS_ACTIVE ? `8.5rem` : `6.5rem`,
    ...props
  }
);

const GuidedTourModal = () => {
  const guidedTour = useGuidedTour("GuidedTourModal", (state) => state);
  const {
    currentStep,
    guidedTourState,
    setCurrentStep,
    setStepState,
    isGuidedTourVisible,
    setSkipped
  } = guidedTour;
  const { formatMessage } = useIntl();
  const { trackUsage } = useTracking();
  if (!currentStep || !isGuidedTourVisible) {
    return null;
  }
  const stepData = get(LAYOUT_DATA, currentStep);
  const sectionKeys = Object.keys(guidedTourState);
  const [sectionName, stepName] = currentStep.split(".");
  const sectionIndex = sectionKeys.indexOf(sectionName);
  const stepIndex = Object.keys(guidedTourState[sectionName]).indexOf(stepName);
  const hasSectionAfter = sectionIndex < sectionKeys.length - 1;
  const hasStepAfter = stepIndex < Object.keys(guidedTourState[sectionName]).length - 1;
  const handleCtaClick = () => {
    setStepState(currentStep, true);
    if (stepData) {
      trackUsage(stepData.trackingEvent);
    }
    setCurrentStep(null);
  };
  const handleSkip = () => {
    setSkipped(true);
    setCurrentStep(null);
    trackUsage("didSkipGuidedtour");
  };
  return /* @__PURE__ */ jsx(Portal, { children: /* @__PURE__ */ jsx(ModalWrapper, { onClick: handleCtaClick, padding: 8, justifyContent: "center", children: /* @__PURE__ */ jsx(FocusTrap, { onEscape: handleCtaClick, children: /* @__PURE__ */ jsxs(
    Flex,
    {
      direction: "column",
      alignItems: "stretch",
      background: "neutral0",
      width: `66rem`,
      shadow: "popupShadow",
      hasRadius: true,
      padding: 4,
      gap: 8,
      role: "dialog",
      "aria-modal": true,
      onClick: (e) => e.stopPropagation(),
      children: [
        /* @__PURE__ */ jsx(Flex, { justifyContent: "flex-end", children: /* @__PURE__ */ jsx(
          IconButton,
          {
            onClick: handleCtaClick,
            withTooltip: false,
            label: formatMessage({
              id: "app.utils.close-label",
              defaultMessage: "Close"
            }),
            children: /* @__PURE__ */ jsx(Cross, {})
          }
        ) }),
        /* @__PURE__ */ jsx(
          Box,
          {
            paddingLeft: 7,
            paddingRight: 7,
            paddingBottom: !hasStepAfter && !hasSectionAfter ? 8 : 0,
            children: /* @__PURE__ */ jsx(
              GuidedTourStepper,
              {
                title: stepData && "title" in stepData ? stepData.title : void 0,
                cta: stepData && "cta" in stepData ? stepData.cta : void 0,
                onCtaClick: handleCtaClick,
                sectionIndex,
                stepIndex,
                hasSectionAfter,
                children: stepData && "content" in stepData && /* @__PURE__ */ jsx(GuidedTourContent, { ...stepData.content })
              }
            )
          }
        ),
        !(!hasStepAfter && !hasSectionAfter) && /* @__PURE__ */ jsx(Flex, { justifyContent: "flex-end", children: /* @__PURE__ */ jsx(Button, { variant: "tertiary", onClick: handleSkip, children: formatMessage({
          id: "app.components.GuidedTour.skip",
          defaultMessage: "Skip the tour"
        }) }) })
      ]
    }
  ) }) }) });
};
const ModalWrapper = styled(Flex)`
  position: fixed;
  z-index: 4;
  inset: 0;
  /* this is theme.colors.neutral800 with opacity */
  background: ${({ theme }) => `${theme.colors.neutral800}1F`};
`;
const GuidedTourStepper = ({
  title,
  children,
  cta,
  onCtaClick,
  sectionIndex,
  stepIndex,
  hasSectionAfter
}) => {
  const { formatMessage } = useIntl();
  const hasSectionBefore = sectionIndex > 0;
  const hasStepsBefore = stepIndex > 0;
  const nextSectionIndex = sectionIndex + 1;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Flex, { alignItems: "stretch", children: [
      /* @__PURE__ */ jsx(Flex, { marginRight: 8, justifyContent: "center", minWidth: `3rem`, children: hasSectionBefore && /* @__PURE__ */ jsx(VerticalDivider, { state: STATES.IS_DONE, minHeight: `2.4rem` }) }),
      /* @__PURE__ */ jsx(Typography, { variant: "sigma", textColor: "primary600", children: formatMessage({
        id: "app.components.GuidedTour.title",
        defaultMessage: "3 steps to get started"
      }) })
    ] }),
    /* @__PURE__ */ jsxs(Flex, { children: [
      /* @__PURE__ */ jsx(Flex, { marginRight: 8, minWidth: `3rem`, children: /* @__PURE__ */ jsx(
        Number$1,
        {
          state: hasStepsBefore ? STATES.IS_DONE : STATES.IS_ACTIVE,
          paddingTop: 3,
          paddingBottom: 3,
          children: sectionIndex + 1
        }
      ) }),
      title && /* @__PURE__ */ jsx(Typography, { variant: "alpha", fontWeight: "bold", textColor: "neutral800", tag: "h3", id: "title", children: formatMessage(title) })
    ] }),
    /* @__PURE__ */ jsxs(Flex, { alignItems: "stretch", children: [
      /* @__PURE__ */ jsx(Flex, { marginRight: 8, direction: "column", justifyContent: "center", minWidth: `3rem`, children: hasSectionAfter && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(VerticalDivider, { state: STATES.IS_DONE }),
        hasStepsBefore && /* @__PURE__ */ jsx(Number$1, { state: STATES.IS_ACTIVE, paddingTop: 3, children: nextSectionIndex + 1 })
      ] }) }),
      /* @__PURE__ */ jsxs(Box, { children: [
        children,
        cta && (cta.target ? /* @__PURE__ */ jsx(
          LinkButton,
          {
            tag: NavLink$1,
            endIcon: /* @__PURE__ */ jsx(ArrowRight, {}),
            onClick: onCtaClick,
            to: cta.target,
            children: formatMessage(cta.title)
          }
        ) : /* @__PURE__ */ jsx(Button, { endIcon: /* @__PURE__ */ jsx(ArrowRight, {}), onClick: onCtaClick, children: formatMessage(cta.title) }))
      ] })
    ] }),
    hasStepsBefore && hasSectionAfter && /* @__PURE__ */ jsx(Box, { paddingTop: 3, children: /* @__PURE__ */ jsx(Flex, { marginRight: 8, justifyContent: "center", width: `3rem`, children: /* @__PURE__ */ jsx(VerticalDivider, { state: STATES.IS_DONE, minHeight: `2.4rem` }) }) })
  ] });
};
const GuidedTourContent = ({ id, defaultMessage }) => {
  const { formatMessage } = useIntl();
  return /* @__PURE__ */ jsx(Flex, { direction: "column", alignItems: "stretch", gap: 4, paddingBottom: 6, children: formatMessage(
    { id, defaultMessage },
    {
      documentationLink: DocumentationLink,
      b: Bold,
      p: Paragraph,
      light: Light,
      ul: List,
      li: ListItem
    }
  ) });
};
const DocumentationLink = (children) => /* @__PURE__ */ jsx(
  Typography,
  {
    tag: "a",
    textColor: "primary600",
    target: "_blank",
    rel: "noopener noreferrer",
    href: "https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest-api.html#api-parameters",
    children
  }
);
const Bold = (children) => /* @__PURE__ */ jsx(Typography, { fontWeight: "semiBold", children });
const Paragraph = (children) => /* @__PURE__ */ jsx(Typography, { children });
const Light = (children) => /* @__PURE__ */ jsx(Typography, { textColor: "neutral600", children });
const List = (children) => /* @__PURE__ */ jsx(Box, { paddingLeft: 6, children: /* @__PURE__ */ jsx("ul", { children }) });
const LiStyled = styled.li`
  list-style: disc;
  &::marker {
    color: ${({ theme }) => theme.colors.neutral800};
  }
`;
const ListItem = (children) => /* @__PURE__ */ jsx(LiStyled, { children });

const MainNavWrapper = styled(Flex)`
  border-right: 1px solid ${({ theme }) => theme.colors.neutral150};
`;
const MainNav = (props) => /* @__PURE__ */ jsx(
  MainNavWrapper,
  {
    alignItems: "normal",
    tag: "nav",
    background: "neutral0",
    direction: "column",
    height: "100vh",
    position: "sticky",
    top: 0,
    zIndex: 2,
    width: 10,
    ...props
  }
);

const BrandIconWrapper = styled(Flex)`
  svg,
  img {
    border-radius: ${({ theme }) => theme.borderRadius};
    object-fit: contain;
    height: 2.4rem;
    width: 2.4rem;
  }
`;
const NavBrand = () => {
  const { formatMessage } = useIntl();
  const {
    logos: { menu }
  } = useConfiguration("LeftMenu");
  return /* @__PURE__ */ jsx(Box, { padding: 3, children: /* @__PURE__ */ jsxs(BrandIconWrapper, { direction: "column", justifyContent: "center", width: "3.2rem", height: "3.2rem", children: [
    /* @__PURE__ */ jsx(
      "img",
      {
        src: menu.custom?.url || menu.default,
        alt: formatMessage({
          id: "app.components.LeftMenu.logo.alt",
          defaultMessage: "Application logo"
        }),
        width: "100%",
        height: "100%"
      }
    ),
    /* @__PURE__ */ jsxs(VisuallyHidden, { children: [
      /* @__PURE__ */ jsx("span", { children: formatMessage({
        id: "app.components.LeftMenu.navbrand.title",
        defaultMessage: "Strapi Dashboard"
      }) }),
      /* @__PURE__ */ jsx("span", { children: formatMessage({
        id: "app.components.LeftMenu.navbrand.workplace",
        defaultMessage: "Workplace"
      }) })
    ] })
  ] }) });
};

const MainNavLinkWrapper = styled(NavLink$1)`
  text-decoration: none;
  display: flex;
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ theme }) => theme.colors.neutral0};
  color: ${({ theme }) => theme.colors.neutral500};
  position: relative;
  width: fit-content;
  padding-block: 0.6rem;
  padding-inline: 0.6rem;

  &:hover,
  &.active {
    background: ${({ theme }) => theme.colors.neutral100};
  }

  &:hover {
    svg path {
      fill: ${({ theme }) => theme.colors.neutral600};
    }
    color: ${({ theme }) => theme.colors.neutral700};
  }

  &.active {
    svg path {
      fill: ${({ theme }) => theme.colors.primary600};
    }

    color: ${({ theme }) => theme.colors.primary600};
    font-weight: 500;
  }
`;
const LinkImpl = ({ children, ...props }) => {
  return /* @__PURE__ */ jsx(MainNavLinkWrapper, { ...props, children });
};
const TooltipImpl = ({ children, label, position = "right" }) => {
  return /* @__PURE__ */ jsx(Tooltip, { side: position, label, delayDuration: 0, children: /* @__PURE__ */ jsx("span", { children }) });
};
const IconImpl = ({ label, children }) => {
  if (!children) {
    return null;
  }
  return /* @__PURE__ */ jsx(AccessibleIcon, { label, children });
};
const CustomBadge = styled(Badge)`
  /* override default badge styles to change the border radius of the Base element in the Design System */
  border-radius: ${({ theme }) => theme.spaces[10]};
  height: 2rem;
`;
const BadgeImpl = ({ children, label, ...props }) => {
  if (!children) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    CustomBadge,
    {
      position: "absolute",
      top: "-0.8rem",
      left: "1.7rem",
      "aria-label": label,
      active: false,
      ...props,
      children
    }
  );
};
const NavLink = {
  Link: LinkImpl,
  Tooltip: TooltipImpl,
  Icon: IconImpl,
  Badge: BadgeImpl
};

const MenuTrigger = styled(Menu.Trigger)`
  height: 100%;
  border-radius: 0;
  border-width: 1px 0 0 0;
  border-color: ${({ theme }) => theme.colors.neutral150};
  border-style: solid;
  padding: ${({ theme }) => theme.spaces[3]};
  // padding 12px - 1px border width
  padding-top: 11px;
  // Prevent empty pixel from appearing below the main nav
  overflow: hidden;
`;
const MenuContent = styled(Menu.Content)`
  left: ${({ theme }) => theme.spaces[5]};
`;
const MenuItem = styled(Menu.Item)`
  & > span {
    width: 100%;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spaces[3]};
    justify-content: space-between;
  }
`;
const MenuItemDanger = styled(MenuItem)`
  &:hover {
  ${({ theme }) => `
    background: ${theme.colors.danger100};
  `}
`;
const NavUser = ({ children, initials, ...props }) => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const logout = useAuth("Logout", (state) => state.logout);
  const handleProfile = () => {
    navigate("/me");
  };
  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };
  return /* @__PURE__ */ jsx(Flex, { justifyContent: "center", ...props, children: /* @__PURE__ */ jsxs(Menu.Root, { children: [
    /* @__PURE__ */ jsxs(MenuTrigger, { endIcon: null, fullWidth: true, justifyContent: "center", children: [
      /* @__PURE__ */ jsx(Avatar.Item, { delayMs: 0, fallback: initials }),
      /* @__PURE__ */ jsx(VisuallyHidden, { tag: "span", children })
    ] }),
    /* @__PURE__ */ jsxs(MenuContent, { popoverPlacement: "top-center", zIndex: 3, children: [
      /* @__PURE__ */ jsx(MenuItem, { onSelect: handleProfile, children: formatMessage({
        id: "global.profile",
        defaultMessage: "Profile"
      }) }),
      /* @__PURE__ */ jsxs(MenuItemDanger, { onSelect: handleLogout, color: "danger600", children: [
        formatMessage({
          id: "app.components.LeftMenu.logout",
          defaultMessage: "Logout"
        }),
        /* @__PURE__ */ jsx(SignOut, {})
      ] })
    ] })
  ] }) });
};

const sortLinks = (links) => {
  return links.sort((a, b) => {
    const positionA = a.position ?? 6;
    const positionB = b.position ?? 6;
    if (positionA < positionB) {
      return -1;
    } else {
      return 1;
    }
  });
};
const NavLinkBadgeCounter = styled(NavLink.Badge)`
  span {
    color: ${({ theme }) => theme.colors.neutral0};
  }
`;
const NavLinkBadgeLock = styled(NavLink.Badge)`
  background-color: transparent;
`;
const NavListWrapper = styled(Flex)`
  overflow-y: auto;
`;
const LeftMenu = ({ generalSectionLinks, pluginsSectionLinks }) => {
  const user = useAuth("AuthenticatedApp", (state) => state.user);
  const { trackUsage } = useTracking();
  const { pathname } = useLocation();
  const userDisplayName = getDisplayName(user);
  const { formatMessage, locale } = useIntl();
  const formatter = useCollator(locale, {
    sensitivity: "base"
  });
  const initials = userDisplayName.split(" ").map((name) => name.substring(0, 1)).join("").substring(0, 2);
  const handleClickOnLink = (destination) => {
    trackUsage("willNavigate", { from: pathname, to: destination });
  };
  const listLinksAlphabeticallySorted = [...pluginsSectionLinks, ...generalSectionLinks].sort(
    (a, b) => formatter.compare(formatMessage(a.intlLabel), formatMessage(b.intlLabel))
  );
  const listLinks = sortLinks(listLinksAlphabeticallySorted);
  return /* @__PURE__ */ jsxs(MainNav, { children: [
    /* @__PURE__ */ jsx(NavBrand, {}),
    /* @__PURE__ */ jsx(Divider, {}),
    /* @__PURE__ */ jsx(NavListWrapper, { tag: "ul", gap: 3, direction: "column", flex: 1, paddingTop: 3, paddingBottom: 3, children: listLinks.length > 0 ? listLinks.map((link) => {
      const LinkIcon = link.icon;
      const badgeContentLock = link?.licenseOnly ? /* @__PURE__ */ jsx(Lightning, { fill: "warning500" }) : void 0;
      const badgeContentNumeric = link.notificationsCount && link.notificationsCount > 0 ? link.notificationsCount.toString() : void 0;
      const labelValue = formatMessage(link.intlLabel);
      return /* @__PURE__ */ jsx(Flex, { tag: "li", children: /* @__PURE__ */ jsx(NavLink.Tooltip, { label: labelValue, children: /* @__PURE__ */ jsxs(
        NavLink.Link,
        {
          to: link.to,
          onClick: () => handleClickOnLink(link.to),
          "aria-label": labelValue,
          children: [
            /* @__PURE__ */ jsx(NavLink.Icon, { label: labelValue, children: /* @__PURE__ */ jsx(LinkIcon, { width: "20", height: "20", fill: "neutral500" }) }),
            badgeContentLock ? /* @__PURE__ */ jsx(
              NavLinkBadgeLock,
              {
                label: "locked",
                textColor: "neutral500",
                paddingLeft: 0,
                paddingRight: 0,
                children: badgeContentLock
              }
            ) : badgeContentNumeric ? /* @__PURE__ */ jsx(
              NavLinkBadgeCounter,
              {
                label: badgeContentNumeric,
                backgroundColor: "primary600",
                width: "2.3rem",
                color: "neutral0",
                children: badgeContentNumeric
              }
            ) : null
          ]
        }
      ) }) }, link.to);
    }) : null }),
    /* @__PURE__ */ jsx(NavUser, { initials, children: userDisplayName })
  ] });
};

const onboardingPreview = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABQCAMAAAD2kgFPAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAL9UExURff3+fv7+/X19/Pz9/n5+fv7/f39//////39/UdwTPn5+/X1+fHx++/v8fn5/fHx8/Pz9eTk6e/v8/Hx9fHx/e3u7/X19e3t8evr7+fn6YuR96Gl+OLi59LS2dTU2uvr++nq7ff39+Tk697e4ufn6+vr7enq69ra3tDQ1uDg5/nv7+Dg5Nzc4Nzd4tTU2OTk5+fn7djY3tzc5M/Q1NjY3NLS1tbX3MzM0u/w9crK0unp7+np+/37+8rK0MjIzu/v78PEy9ra4djY4eLi6t7e5NbW2s7O1OLk5+/v/Ojp/dra5MPF9+3u89bX3mxz99DQ2fj4+OLi5PHx8dvb29ze+/f3/7C1+t7e5+vr69PX2OPk/Jydl/T09/f393R7+Gdw96ytuNTU3M7O2ODg6a6vumJq9+3u/dTW/PP19cXGzd7e4O3t7cnK+/f3+uLk683O+Z2h+dLU+9/h++no3/j39bq0pu/v7fv7+fHz9XF4911l93V8+bm5waGirffr7Kqrtq+z9qentF9o93mA+fj4+vr6++/v7/f3++vt+83N0/Pz8+vr8dbY+sjJ98zO1crM0vn5//Pz/ra6n/n59d/g4quvp9fa2OTn66Shm8C2prCuq+/r67Gxr9LLvbCwrcfEwK+vqZSahtPVw5WafKiknff5+ZqapvHw7fv4+YGH9dnb++Tn/Ly8xvfo6Oq5v////6WlsNrc3vPz+dLU2Ovr/eTn+drc4JWXo6Wp+cLE++nr74+T+enr4s7Q1m5098bArefk5Nze0ODc1Pf3/MC8tuDi0KWrh/n39+Tk4qmv+77Cqdjc3PX1/c7S0vv7/7ixo/Px7Z+jh62x+8rMtrS6pZebjY+Rn9bayKuvm+vp5+np6aWrjVJa9fX38bi895+fm1pk9620oevp6bS0r+fp6fv19VZg9fn19X6F+fnz89LS3MDAyPXi4uextvX1+vPW2OCVnYmJl9zc4Xh4iff3+mdy97y8xPf3977C96mpsbS29YeHlamv84qS87i89VXx8BYAAAD/dFJOU319fX19fX19fQB9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19bX19fX19fX19fX19Lwd9fX19fX19fX19fX19fX1lfX19fX19fX19fX19fX19fX19fX19fW1dED59fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX0PfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1mfX19bX1eXn0/fX19fX0/fSWruQsAAAbiSURBVGje7VkFcBtHFD2SbnXO9UA56dRIiiRbFFlmiO3asWKIE0MYGrQbZmjDDA1T06RJ03DSJA2XMaWUmZmZmWm6ki3lTie59kTSlJ40p5nV//tud//b/28P0WiG/PgdkhBMHKzRaBDNyWXSRoqi4ki57CQk/MZsKna58pqa0N4gnoNcNgQZzBV8ml9aYMYaW4DQRKjvDC8MG7TkG0ff+gmobifD78gXYQZE0++8b08tXFg/4uf6H46VLh5Rf/P8TERtXG1ykkmtI7zmtZFLhtW9NWfOnCUjhy0Z+T2CJOFYJMOS+YtPzV884teDX8879sKIhfUHSxG1AzH0ajXhB3UjPxpaVzd37uyls5cunRv30Fx0vhxRDfXdLLbhZWU2W1mGGNtbEPuXdStz+2ycu/+kbmv4YLOWZ3merdEyNSweW0KMxXkW1+J4RwxeMeRfCIbhMsu7/LUd0QgkSYkW8TS5wznVlg93W8LnEiUooAIqFYBQkxBnSIxkMStJVLUPoah90cCqlSurWkSI6ijdGGv0v0Wv3iaIa1i9KLJ+QoR0Wk0l2YCo6jO5unpq9dTJkyesW7uu+oZp09q0iLDXvOQNG0r9uxbtNdU2hIcidV4YELTpt40C17WIsMk9oAyapxMbNxiCR4uRWAP2TNOZ3S/KCmdEyfggEORQ9Xh4kKPkM8O6AjbIS/BWfZLED+N5StmbisEZRttRTzVD2LZtUdW09gPbFx0tatuE0Y2E/YYeVYlI0E7ELYjET68vJJS9nZdRc1shq7dgzRIeKfrtj0W//LTojTDCOE2pMsjb3BiQhSo+gF3jOJNhKQwPUgqcBdqhER+Cc4efUOvL8nFKwhxn/tjKtNLTY12HO3z15ecnTiz4ODaEkUEBgoKqIRAdgR3u8NmC4wuOd3g/noSoWoILGgHU5w7/jGpxbQ28dJRl3/AoPfR6jKIUqcnKstkm2fpnZOlZGSFBqUgQtLt6/9vvSf0Y/19qENYbgIpHSQBvFk6ekgy2NZO9SIqk1Pag7Ttvvttb6pu3Ps9lTtvsqsiTtmLpnC83L8fpyjXlmpMVhDYS+IKbN6YkBNINaubunWiMphTh9d0L1tcqMj6IDwKdszgeYYR9u6old/bsi1SsRohhs3heVBK2mz1QLQTthOe3Xyj1q8xJ3uwZZ/A5jbI17GlPyUlNTk31jHN6DQoyhgLuQNVm7l7bWZkPb719FBnKCIcOTJ8h9bVi8GO16hCdLAxR1N9E6HSsDlOmDGjLNBOlcnR6KlY6RFitODzFlrCM799qyt1eZV1KEqhU+E+/5EiE8EML/8qgXVdIfbPHZhfkrrp2bL5J2sqmJptL8nOzi9fnFxekKgjLUOB/rub58obMCEGjVoGzI7x8986Z5zydsDcQkMXWQguPJG4No25tslXYt08Vs62N8TaYvUnKNVSh6tVBuxl798iE7/QYuRSO5jhB2koYGCHZ4PBwKV2MnF5BhlPqxsqC1uJshKChUDIk3qsOPPmy1LeXIIgMzToYWtqK6nS0vRNNC+P1gqgUPrwFfYuFP+DiWK5hCwhjFzSF/WuzOnd2uwt9fEcZ4dp+l52VxSWvPueQb4ugMc7lcY8GhA+iC5+CETqLhV8Ww5iwmmbKsD4glPHtg3bIhJ/mMpucuelpabK8jqVyqdkVOea0nOtzTR4FYQoKvM1MadcJfSUjvO+uB2MlfP+hgrtLAoUf5VAhzPCe++MepVD4gAmlw71bZMLvnZ5ucBhpe0+ZDokuUPgpnJETofDtkYSfEjhUKP8ks0G5eaOoVPjbpt8t9XUYOU+6gfZYZIUEytMOzmB39OzJGThaQZgBv1EPFeIr/AiHCnEMmmiHCgMnnJHI4oFNjGzySEBGVDZsD2g+ovChX3DzjpCeptT1AaEdf8CgHbKgcbnSXBUmoykvRyb8ZKMnrSIzz2Q2myKV+iHhY0laJeGRfhLhW/dcqWulxqOOkOFNp7v78IRm/BZkiztiF6WRDxX85zRFIKTDGfu3PCr1SxcEmGd1jMDKhD9+jE6kRZHWdrILSh3CTsVAXZqa5eWUhA8P7UqGuuu0bfpDso3fuJXjDILHIBc+LQgp6XaHMd1o4HpFyvgZzUzpE49Jn5563wv+qRk/ej6culFSCG96RBc74UcmnHJnH2A5K/xdj0t9S0oLirMrvSWrKmSlvvMmZ3GBuTI/u7IkX1nqW1BQ2wzh6FskNY11eyuFH2kC4DJRf581/B+tQHzfK4e9ZsIQBkFHbURgLQMfX9x4vAlh1sMhIYnAhxhYxVgSNE6C+E+F0KWJpZuIrEgs4WBkSI9E8vXQIJrlCWTssRwSajSDJyYoXFYM0Wj+BNjsk7mwYOwbAAAAAElFTkSuQmCC";

const Onboarding = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { formatMessage } = useIntl();
  const communityEdition = useAppInfo("Onboarding", (state) => state.communityEdition);
  const docLinks = [
    ...DOCUMENTATION_LINKS,
    {
      label: { id: "Settings.application.get-help", defaultMessage: "Get help" },
      icon: Message,
      href: communityEdition ? "https://discord.strapi.io" : "https://support.strapi.io/support/home"
    }
  ];
  const showHelpButton = false;
  return /* @__PURE__ */ jsxs(Popover.Root, { onOpenChange: setIsOpen, children: [
    showHelpButton,
    /* @__PURE__ */ jsxs(Popover.Content, { align: "end", side: "top", sideOffset: 12, children: [
      /* @__PURE__ */ jsxs(
        Flex,
        {
          justifyContent: "space-between",
          paddingBottom: 5,
          paddingRight: 6,
          paddingLeft: 6,
          paddingTop: 6,
          children: [
            /* @__PURE__ */ jsx(TypographyLineHeight, { fontWeight: "bold", children: formatMessage({
              id: "app.components.Onboarding.title",
              defaultMessage: "Get started videos"
            }) }),
            /* @__PURE__ */ jsx(
              TextLink,
              {
                tag: "a",
                href: WATCH_MORE.href,
                target: "_blank",
                rel: "noreferrer noopener",
                variant: "pi",
                textColor: "primary600",
                children: formatMessage(WATCH_MORE.label)
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx(Divider, {}),
      VIDEO_LINKS.map(({ href, duration, label }, index) => /* @__PURE__ */ jsxs(
        VideoLinkWrapper,
        {
          tag: "a",
          href,
          target: "_blank",
          rel: "noreferrer noopener",
          hasRadius: true,
          paddingTop: 4,
          paddingBottom: 4,
          paddingLeft: 6,
          paddingRight: 11,
          children: [
            /* @__PURE__ */ jsx(Box, { paddingRight: 5, children: /* @__PURE__ */ jsx(Number, { textColor: "neutral200", variant: "alpha", children: index + 1 }) }),
            /* @__PURE__ */ jsxs(Box, { position: "relative", children: [
              /* @__PURE__ */ jsx(Preview, { src: onboardingPreview, alt: "" }),
              /* @__PURE__ */ jsx(
                IconWrapper,
                {
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  background: "primary600",
                  borderRadius: "50%",
                  justifyContent: "center",
                  width: 6,
                  height: 6,
                  children: /* @__PURE__ */ jsx(Play, { fill: "buttonNeutral0", width: "12", height: "12" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "start", paddingLeft: 4, children: [
              /* @__PURE__ */ jsx(Label, { fontWeight: "bold", children: formatMessage(label) }),
              /* @__PURE__ */ jsx(VisuallyHidden, { children: ":" }),
              /* @__PURE__ */ jsx(Typography, { textColor: "neutral600", variant: "pi", children: duration })
            ] })
          ]
        },
        href
      )),
      /* @__PURE__ */ jsx(
        Flex,
        {
          direction: "column",
          alignItems: "stretch",
          gap: 2,
          paddingLeft: 5,
          paddingTop: 2,
          paddingBottom: 5,
          children: docLinks.map(({ label, href, icon: Icon2 }) => /* @__PURE__ */ jsxs(Flex, { gap: 3, children: [
            /* @__PURE__ */ jsx(Icon2, { fill: "primary600" }),
            /* @__PURE__ */ jsx(
              TextLink,
              {
                tag: "a",
                href,
                target: "_blank",
                rel: "noreferrer noopener",
                variant: "sigma",
                textColor: "primary700",
                children: formatMessage(label)
              }
            )
          ] }, href))
        }
      )
    ] })
  ] });
};
styled(Button)`
  border-radius: 50%;
  padding: ${({ theme }) => theme.spaces[3]};
  /* Resetting 2rem height defined by Button component */
  height: unset;
  width: unset;

  & > span {
    display: flex;

    svg {
      width: 1.6rem;
      height: 1.6rem;
    }
  }
`;
const IconWrapper = styled(Flex)`
  transform: translate(-50%, -50%);
`;
const Number = styled(Typography)``;
const Label = styled(Typography)``;
const VideoLinkWrapper = styled(Flex)`
  text-decoration: none;

  :focus-visible {
    outline-offset: ${({ theme }) => `-${theme.spaces[1]}`};
  }

  :hover {
    background: ${({ theme }) => theme.colors.primary100};

    /* Hover style for the number displayed */
    ${Number} {
      color: ${({ theme }) => theme.colors.primary500};
    }

    /* Hover style for the label */
    ${Label} {
      color: ${({ theme }) => theme.colors.primary600};
    }
  }
`;
const Preview = styled.img`
  width: ${({ theme }) => theme.spaces[10]};
  height: ${({ theme }) => theme.spaces[8]};
  /* Same overlay used in ModalLayout */
  background: ${({ theme }) => `${theme.colors.neutral800}1F`};
  border-radius: ${({ theme }) => theme.borderRadius};
`;
const TypographyLineHeight = styled(Typography)`
  /* line height of label and watch more to 1 so they can be better aligned visually */
  line-height: 1;
`;
const TextLink = styled(Typography)`
  text-decoration: none;
  line-height: 1;

  :hover {
    text-decoration: underline;
  }
`;
const VIDEO_LINKS = [
  {
    label: {
      id: "app.components.Onboarding.link.build-content",
      defaultMessage: "Build a content architecture"
    },
    href: "https://www.youtube.com/watch?v=G9GjN0RxhkE",
    duration: "5:48"
  },
  {
    label: {
      id: "app.components.Onboarding.link.manage-content",
      defaultMessage: "Add & manage content"
    },
    href: "https://www.youtube.com/watch?v=DEZw4KbybAI",
    duration: "3:18"
  },
  {
    label: { id: "app.components.Onboarding.link.manage-media", defaultMessage: "Manage media" },
    href: "https://www.youtube.com/watch?v=-61MuiMQb38",
    duration: "3:41"
  }
];
const WATCH_MORE = {
  href: "https://www.youtube.com/playlist?list=PL7Q0DQYATmvidz6lEmwE5nIcOAYagxWqq",
  label: {
    id: "app.components.Onboarding.link.more-videos",
    defaultMessage: "Watch more videos"
  }
};
const DOCUMENTATION_LINKS = [
  {
    label: { id: "global.documentation", defaultMessage: "documentation" },
    href: "https://docs.strapi.io",
    icon: Book
  },
  {
    label: { id: "app.static.links.cheatsheet", defaultMessage: "cheatsheet" },
    href: "https://strapi-showcase.s3-us-west-2.amazonaws.com/CheatSheet.pdf",
    icon: PaperPlane
  }
];

const PluginsInitializer = ({ children }) => {
  const appPlugins = useStrapiApp("PluginsInitializer", (state) => state.plugins);
  const [{ plugins }, dispatch] = React.useReducer(
    reducer,
    initialState,
    () => init(appPlugins)
  );
  const setPlugin = React.useRef((pluginId) => {
    dispatch({ type: "SET_PLUGIN_READY", pluginId });
  });
  const hasApluginNotReady = Object.keys(plugins).some(
    (plugin) => plugins[plugin].isReady === false
  );
  if (hasApluginNotReady) {
    const initializers = Object.keys(plugins).reduce((acc, current) => {
      const InitializerComponent = plugins[current].initializer;
      if (InitializerComponent) {
        const key = plugins[current].pluginId;
        acc.push(/* @__PURE__ */ jsx(InitializerComponent, { setPlugin: setPlugin.current }, key));
      }
      return acc;
    }, []);
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      initializers,
      /* @__PURE__ */ jsx(Page.Loading, {})
    ] });
  }
  return children;
};
const initialState = {
  plugins: {}
};
const reducer = (state = initialState, action) => produce(state, (draftState) => {
  switch (action.type) {
    case "SET_PLUGIN_READY": {
      set(draftState, ["plugins", action.pluginId, "isReady"], true);
      break;
    }
    default:
      return draftState;
  }
});
const init = (plugins) => {
  return {
    plugins
  };
};

const useMenu = (shouldUpdateStrapi) => {
  const checkUserHasPermissions = useAuth("useMenu", (state) => state.checkUserHasPermissions);
  const menu = useStrapiApp("useMenu", (state) => state.menu);
  const permissions = useTypedSelector((state) => state.admin_app.permissions);
  const [menuWithUserPermissions, setMenuWithUserPermissions] = React.useState({
    generalSectionLinks: [
      {
        icon: House,
        intlLabel: {
          id: "global.home",
          defaultMessage: "Home"
        },
        to: "/",
        permissions: [],
        position: 0
      },
      {
        icon: ShoppingCart,
        intlLabel: {
          id: "global.marketplace",
          defaultMessage: "Marketplace"
        },
        to: "/marketplace",
        permissions: permissions.marketplace?.main ?? [],
        position: 7
      },
      {
        icon: Cog,
        intlLabel: {
          id: "global.settings",
          defaultMessage: "Settings"
        },
        to: "/settings",
        // Permissions of this link are retrieved in the init phase
        // using the settings menu
        permissions: [],
        notificationsCount: 0,
        position: 9
      }
    ],
    pluginsSectionLinks: [],
    isLoading: true
  });
  const generalSectionLinksRef = React.useRef(menuWithUserPermissions.generalSectionLinks);
  React.useEffect(() => {
    async function applyMenuPermissions() {
      const authorizedPluginSectionLinks = await getPluginSectionLinks(
        menu,
        checkUserHasPermissions
      );
      const authorizedGeneralSectionLinks = await getGeneralLinks(
        generalSectionLinksRef.current,
        shouldUpdateStrapi,
        checkUserHasPermissions
      );
      setMenuWithUserPermissions((state) => ({
        ...state,
        generalSectionLinks: authorizedGeneralSectionLinks,
        pluginsSectionLinks: authorizedPluginSectionLinks,
        isLoading: false
      }));
    }
    applyMenuPermissions();
  }, [
    setMenuWithUserPermissions,
    generalSectionLinksRef,
    menu,
    permissions,
    shouldUpdateStrapi,
    checkUserHasPermissions
  ]);
  return menuWithUserPermissions;
};
const getGeneralLinks = async (generalSectionRawLinks, shouldUpdateStrapi = false, checkUserHasPermissions) => {
  const generalSectionLinksPermissions = await Promise.all(
    generalSectionRawLinks.map(({ permissions }) => checkUserHasPermissions(permissions))
  );
  const authorizedGeneralSectionLinks = generalSectionRawLinks.filter(
    (_, index) => generalSectionLinksPermissions[index].length > 0
  );
  const settingsLinkIndex = authorizedGeneralSectionLinks.findIndex(
    (obj) => obj.to === "/settings"
  );
  if (settingsLinkIndex === -1) {
    return [];
  }
  const authorizedGeneralLinksClone = cloneDeep(authorizedGeneralSectionLinks);
  authorizedGeneralLinksClone[settingsLinkIndex].notificationsCount = shouldUpdateStrapi ? 1 : 0;
  return authorizedGeneralLinksClone;
};
const getPluginSectionLinks = async (pluginsSectionRawLinks, checkUserHasPermissions) => {
  const pluginSectionLinksPermissions = await Promise.all(
    pluginsSectionRawLinks.map(({ permissions }) => checkUserHasPermissions(permissions))
  );
  const authorizedPluginSectionLinks = pluginsSectionRawLinks.filter(
    (_, index) => pluginSectionLinksPermissions[index].length > 0
  );
  return authorizedPluginSectionLinks;
};

const strapiVersion = packageJSON.version;
const AdminLayout = () => {
  const setGuidedTourVisibility = useGuidedTour(
    "AdminLayout",
    (state) => state.setGuidedTourVisibility
  );
  const { formatMessage } = useIntl();
  const userInfo = useAuth("AuthenticatedApp", (state) => state.user);
  const [userId, setUserId] = React.useState();
  const { showReleaseNotification } = useConfiguration("AuthenticatedApp");
  const { data: appInfo, isLoading: isLoadingAppInfo } = useInformationQuery();
  const [tagName, setTagName] = React.useState(strapiVersion);
  React.useEffect(() => {
    if (showReleaseNotification) {
      fetch("https://api.github.com/repos/strapi/strapi/releases/latest").then(async (res) => {
        if (!res.ok) {
          return;
        }
        const response = await res.json();
        if (!response.tag_name) {
          throw new Error();
        }
        setTagName(response.tag_name);
      }).catch(() => {
      });
    }
  }, [showReleaseNotification]);
  const userRoles = useAuth("AuthenticatedApp", (state) => state.user?.roles);
  React.useEffect(() => {
    if (userRoles) {
      const isUserSuperAdmin = userRoles.find(({ code }) => code === "strapi-super-admin");
      if (isUserSuperAdmin && appInfo?.autoReload) {
        setGuidedTourVisibility(true);
      }
    }
  }, [userRoles, appInfo?.autoReload, setGuidedTourVisibility]);
  React.useEffect(() => {
    hashAdminUserEmail(userInfo).then((id) => {
      if (id) {
        setUserId(id);
      }
    });
  }, [userInfo]);
  const { trackUsage } = useTracking();
  const {
    isLoading: isLoadingMenu,
    generalSectionLinks,
    pluginsSectionLinks
  } = useMenu(checkLatestStrapiVersion(strapiVersion, tagName));
  const { showTutorials } = useConfiguration("Admin");
  useOnce(() => {
    trackUsage("didAccessAuthenticatedAdministration");
  });
  if (isLoadingMenu || isLoadingAppInfo) {
    return /* @__PURE__ */ jsx(Page.Loading, {});
  }
  return /* @__PURE__ */ jsxs(
    AppInfoProvider,
    {
      ...appInfo,
      userId,
      latestStrapiReleaseTag: tagName,
      shouldUpdateStrapi: checkLatestStrapiVersion(strapiVersion, tagName),
      children: [
        /* @__PURE__ */ jsx(NpsSurvey, {}),
        /* @__PURE__ */ jsx(PluginsInitializer, { children: /* @__PURE__ */ jsx(DndProvider, { backend: HTML5Backend, children: /* @__PURE__ */ jsxs(Box, { background: "neutral100", children: [
          /* @__PURE__ */ jsx(SkipToContent, { children: formatMessage({ id: "skipToContent", defaultMessage: "Skip to content" }) }),
          /* @__PURE__ */ jsxs(Flex, { alignItems: "flex-start", children: [
            /* @__PURE__ */ jsx(
              LeftMenu,
              {
                generalSectionLinks,
                pluginsSectionLinks
              }
            ),
            /* @__PURE__ */ jsxs(Box, { flex: 1, children: [
              /* @__PURE__ */ jsx(Outlet, {}),
              /* @__PURE__ */ jsx(GuidedTourModal, {}),
              showTutorials && /* @__PURE__ */ jsx(Onboarding, {})
            ] })
          ] })
        ] }) }) })
      ]
    }
  );
};
const PrivateAdminLayout = () => {
  return /* @__PURE__ */ jsx(PrivateRoute, { children: /* @__PURE__ */ jsx(AdminLayout, {}) });
};
const checkLatestStrapiVersion = (currentPackageVersion, latestPublishedVersion = "") => {
  if (!valid(currentPackageVersion) || !valid(latestPublishedVersion)) {
    return false;
  }
  return lt(currentPackageVersion, latestPublishedVersion);
};

export { AdminLayout, PrivateAdminLayout };
//# sourceMappingURL=AuthenticatedLayout-pPdBhoMx.mjs.map
