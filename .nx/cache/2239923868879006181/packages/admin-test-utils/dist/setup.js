"use strict";
const util = require("util");
const resizeObserver = require("@juggle/resize-observer");
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;
window.ResizeObserver = resizeObserver.ResizeObserver;
window.setImmediate = window.setImmediate || ((fn, ...args) => window.setTimeout(fn, 0, ...args));
window.clearImmediate = window.clearImmediate || window.clearTimeout;
window.requestIdleCallback = setImmediate;
window.cancelIdleCallback = clearImmediate;
window.console = {
  ...window.console,
  warn(...args) {
    throw new Error(util.format(...args));
  },
  error(...args) {
    const message = util.format(...args);
    if (/(Invalid prop|Failed prop type)/gi.test(message)) {
      throw new Error(message);
    } else if (/React does not recognize the .* prop on a DOM element/.test(message) || /Unknown event handler property/.test(message)) ;
    else if (/Support for defaultProps will be removed/gi.test(message)) ;
    else {
      throw new Error(message);
    }
  }
};
window.strapi = {
  backendURL: "http://192.168.20.14:1337",
  isEE: false,
  features: {
    SSO: "sso",
    isEnabled: () => false
  },
  future: {
    isEnabled: () => false
  },
  projectType: "Community",
  telemetryDisabled: true,
  flags: {
    nps: true,
    promoteEE: true
  }
};
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    /**
     * @deprecated
     */
    addListener: jest.fn(),
    /**
     * @deprecated
     */
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});
Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: jest.fn()
});
Object.defineProperty(window, "prompt", {
  writable: true,
  value: jest.fn()
});
window.URL.createObjectURL = jest.fn().mockImplementation((file) => `http://localhost:4000/assets/${file.name}`);
document.createRange = () => {
  const range = new Range();
  range.getClientRects = jest.fn(() => ({
    item: () => null,
    length: 0
  }));
  return range;
};
class LocalStorageMock {
  store;
  constructor() {
    this.store = /* @__PURE__ */ new Map();
  }
  clear() {
    this.store.clear();
  }
  getItem(key) {
    return this.store.get(key) ?? null;
  }
  setItem(key, value) {
    this.store.set(key, String(value));
  }
  removeItem(key) {
    this.store.delete(key);
  }
  get length() {
    return this.store.size;
  }
}
Object.defineProperty(window, "localStorage", {
  writable: true,
  value: new LocalStorageMock()
});
class MockPointerEvent extends Event {
  button;
  ctrlKey;
  pointerType;
  constructor(type, props) {
    super(type, props);
    this.button = props.button || 0;
    this.ctrlKey = props.ctrlKey || false;
    this.pointerType = props.pointerType || "mouse";
  }
}
Object.defineProperty(window, "PointerEvent", {
  writable: true,
  value: MockPointerEvent
});
window.HTMLElement.prototype.scrollIntoView = jest.fn();
window.HTMLElement.prototype.releasePointerCapture = jest.fn();
window.HTMLElement.prototype.hasPointerCapture = jest.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn()
  }
});
//# sourceMappingURL=setup.js.map
