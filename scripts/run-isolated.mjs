import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawnSync } from 'child_process';

const mode = process.argv[2] ?? 'fail';
const projectRoot = process.cwd();
const workspaceNodeModules = path.join(projectRoot, 'node_modules');

const runDir = fs.mkdtempSync(path.join(os.tmpdir(), 'swagger-fastify-repro-'));
fs.mkdirSync(path.join(runDir, 'node_modules'), { recursive: true });

fs.copyFileSync(path.join(projectRoot, 'dist/index.mjs'), path.join(runDir, 'index.mjs'));
if (fs.existsSync(path.join(projectRoot, 'dist/index.mjs.map'))) {
  fs.copyFileSync(path.join(projectRoot, 'dist/index.mjs.map'), path.join(runDir, 'index.mjs.map'));
}

copyPackage('swagger-ui-dist');

if (mode === 'pass') {
  copyDependencyClosure('@fastify/static');
}

console.log(`Mode: ${mode}`);
console.log(`Run dir: ${runDir}`);

const result = spawnSync('node', ['index.mjs'], {
  cwd: runDir,
  env: { ...process.env, NODE_ENV: 'production' },
  encoding: 'utf8'
});

process.stdout.write(result.stdout || '');
process.stderr.write(result.stderr || '');

if (result.status === 0) {
  console.log('Result: PASS');
} else {
  console.log('Result: FAIL');
}

process.exit(result.status ?? 1);

function copyDependencyClosure(seed) {
  const seen = new Set();

  function visit(pkgName) {
    if (seen.has(pkgName)) return;
    seen.add(pkgName);

    copyPackage(pkgName);

    const packageJsonPath = resolvePackageJson(pkgName);
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const deps = Object.keys(pkg.dependencies || {});
    for (const dep of deps) {
      visit(dep);
    }
  }

  visit(seed);
}

function copyPackage(pkgName) {
  const src = packageDir(pkgName);
  const dst = path.join(runDir, 'node_modules', ...pkgName.split('/'));
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.cpSync(src, dst, { recursive: true });
}

function packageDir(pkgName) {
  return path.dirname(resolvePackageJson(pkgName));
}

function resolvePackageJson(pkgName) {
  return path.join(workspaceNodeModules, ...pkgName.split('/'), 'package.json');
}
