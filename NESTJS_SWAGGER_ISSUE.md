## Bug Report

### Summary

When bundling a Nest Fastify app with Swagger (`@nestjs/swagger` 12.x), runtime fails in an artifact-like isolated environment with:

`The "@fastify/static" package is missing. Please, make sure to install it to use SwaggerModule.`

This happens even with an explicit `import '@fastify/static'` in app bootstrap.

### Reproduction

Repo: `swagger-fastify-runtime-repro` (attached/linked by reporter)

Commands:

```bash
npm install
npm run repro:fail
```

Observed output:

```text
[Nest] ... ERROR [PackageLoader] The "@fastify/static" package is missing. Please, make sure to install it to use SwaggerModule.
Result: FAIL
```

Control command:

```bash
npm run repro:pass
```

Observed output:

```text
Bootstrap success
Result: PASS
```

### Versions

- `@nestjs/swagger`: 12.0.1
- `@nestjs/platform-fastify`: 12.x
- Node.js: 24.x
- bundler: esbuild (bundle + ESM + treeShaking)

### Context

In 12.x, `SwaggerModule` Fastify path uses runtime loading of `@fastify/static` (via `loadPackageSync` + `require('@fastify/static')`).

Because this is runtime package resolution, artifact-only execution fails unless `@fastify/static` and its transitive dependency closure are physically available in runtime `node_modules`.

### Question

Is this runtime behavior intentional for 12.x, and should docs explicitly call out that bundling alone may not be enough for Fastify + Swagger unless runtime `node_modules` contains `@fastify/static`?

Also: is there a recommended bundler-friendly pattern (for Lambda/artifact deployments) to avoid manually copying transitive dependencies?
