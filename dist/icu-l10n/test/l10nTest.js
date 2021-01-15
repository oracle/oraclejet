"use strict";
const assert = require("assert");
const path = require("path");
const parse = require("../Parser");
const fs = require("fs");
const vm = require("vm");
const { TypescriptParser, VariableDeclaration } = require("typescript-parser");
const { expect } = require("chai");

function runTestCases(extractBundle) {
  it("ignores unsupported types", () => {
    const bundle = extractBundle(`app-strings.js`);
    assert(
      Object.keys(bundle).indexOf("@count") === -1,
      "@count should not be in bundle"
    );
    assert(
      Object.keys(bundle).indexOf("@@x-base-bundle") === -1,
      "@@x-base-bundle should not be in bundle"
    );
  });

  it("creates the root bundle in English", () => {
    const bundle = extractBundle(`app-strings.js`);
    assert.equal(
      bundle.contentArea({ name: "Dashboard" }),
      "Dashboard Content Area"
    );
    assert.equal(
      bundle.pageIntro({ name: "Dashboard" }),
      "To change the content of this section, you will make edits to the Dashboard file located in the /js/views folder."
    );
  });

  it("creates the ru bundle in Russian", () => {
    const bundle = extractBundle(`ru/app-strings.js`);
    // Derived value from root bundle--in English
    assert.equal(bundle.welcome(), "Welcome");
    assert.equal(
      bundle.contentArea({ name: "Dashboard" }),
      "Dashboard область содержимого"
    );
  });

  it("creates the ru-RU bundle in Russian", () => {
    const bundle = extractBundle(`ru-RU/app-strings.js`);
    // Derived value from root bundle--in English
    assert.equal(bundle.welcome(), "Welcome");
    assert.equal(
      bundle.contentArea({ name: "Dashboard" }),
      "Dashboard область содержимого"
    );
    assert.equal(
      bundle.pageIntro({ name: "Dashboard" }),
      "Чтобы изменить содержимое этого раздела, вы внесете изменения в файл Dashboard, расположенный в папке /js/views."
    );
  });

  it("creates parameterized plural values", () => {
    const bundle = extractBundle(`ru-RU/app-strings.js`);
    assert.equal(
      bundle.invitation({
        host: "Barbara",
        guest: "Phil",
        gender_of_host: "female",
        num_guests: 0,
      }),
      "Barbara does not give a party."
    );
    assert.equal(
      bundle.invitation({
        host: "Barbara",
        guest: "Phil",
        gender_of_host: "female",
        num_guests: 1,
      }),
      "Barbara invites Phil to her party."
    );
    assert.equal(
      bundle.invitation({
        host: "Barbara",
        guest: "Phil",
        gender_of_host: "female",
        num_guests: 2,
      }),
      "Barbara invites Phil and one other person to her party."
    );
    assert.equal(
      bundle.invitation({
        host: "Bob",
        guest: "Sue",
        gender_of_host: "male",
        num_guests: 3,
      }),
      "Bob invites Sue and 2 other people to his party."
    );
  });

  it("uses plural select rules for buckets", () => {
    const bundle = extractBundle(`ru-RU/app-strings.js`);
    assert.equal(
      bundle.plural({
        total_rows: 0,
      }),
      "нет строк"
    );
    assert.equal(
      bundle.plural({
        total_rows: 1,
      }),
      "1 row"
    );
    assert.equal(
      bundle.plural({
        total_rows: 2,
      }),
      "несколько рядов"
    );
  });
}

const outputRoot = path.resolve(__dirname, 'built');

describe("ESM output", () => {
  const outputDir = path.resolve(outputRoot, "esm");
  /**
   * Read contents of ES6 file and convert to CommonJS export for Node testing
   * @param {string} filePath
   */
  function extractBundle(filepath) {
    const bundleContents = fs.readFileSync(path.join(outputDir, filepath)).toString();
    // Remove 'export const' so that the rest of the line creates the variable
    // in the context object
    const script = new vm.Script(bundleContents.replace(/export const /g, ""));
    const context = vm.createContext({});
    script.runInContext(context);
    return context.bundle;
  }

  before(() => {
    parse(`${__dirname}/resources/nls/app-strings.json`, "en-US", outputDir);
  });

  runTestCases(extractBundle);
});

describe('AMD output', () => {
  const outputDir = path.resolve(outputRoot, "amd");
  /**
   * Read contents of ES6 file and convert to CommonJS export for Node testing
   * @param {string} filePath
   */
  function extractBundle(filepath) {
    const bundleContents = fs.readFileSync(path.join(outputDir, filepath)).toString();
    // Create a 'define' method in the context which returns the object passed in
    const script = new vm.Script(bundleContents, "");
    const context = vm.createContext({
      define: ((obj) => obj)
    });
    return script.runInContext(context);
  }

  before(() => {
    parse(`${__dirname}/resources/nls/app-strings.json`, "en-US", outputDir, 'amd');
  });

  runTestCases(extractBundle);
});

describe("Definition file", () => {
  let parsed;

  before(async () => {
    const parser = new TypescriptParser();
    parsed = await parser.parseFile(`${outputRoot}/esm/app-strings.d.ts`);
  });

  it("exports a single 'bundle' object", () => {
    const decl = parsed.declarations[0];
    assert.equal(decl.name, "bundle", "declares 'bundle'");
    assert.ok(decl.isExported, "declaration is exported");
    assert.ok(decl instanceof VariableDeclaration, "declaration is a Type");
  });

  it("defines used keys", () => {
    const usages = parsed.usages;
    expect(usages).to.include.members(['bundle', 'p', 'name', 'host', 'guest', 'num_guests', 'gender_of_host', 'total_rows'])
  });
});
