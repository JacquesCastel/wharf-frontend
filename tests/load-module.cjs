const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
module.exports = function load(file, overrides = {}) {
  const modules = new Map();
  function read(filename) {
    const relative = path.relative(root, filename);
    if (Object.hasOwn(overrides, relative)) return overrides[relative];
    if (modules.has(filename)) return modules.get(filename);
    if (filename.endsWith('.json')) return JSON.parse(fs.readFileSync(filename, 'utf8'));
    const context = { exports: {}, process: { env: {} }, URL, URLSearchParams, console, AbortSignal, fetch };
    modules.set(filename, context.exports);
    context.require = name => {
      if (Object.hasOwn(overrides, name)) return overrides[name];
      if (!name.startsWith('.')) return require(name);
      const base = path.resolve(path.dirname(filename), name);
      const target = ['', '.ts', '.tsx', '.json'].map(ext => base + ext).find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
      if (!target) throw new Error(`Unknown module: ${base}`);
      return read(target);
    };
    const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    vm.runInNewContext(source, context, { filename });
    return context.exports;
  }
  return read(path.resolve(root, file));
};
