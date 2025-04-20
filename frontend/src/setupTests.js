import "@testing-library/jest-dom";
// setupTests.js or vitest.setup.js

global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  