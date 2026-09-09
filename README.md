# Swagger Fastify Runtime Repro

Minimal reproduction for a runtime error with `@nestjs/swagger` on Fastify after bundling:

`The "@fastify/static" package is missing. Please, make sure to install it to use SwaggerModule.`

## Environment

- Node.js 24
- @nestjs/swagger 12.x
- @nestjs/platform-fastify 12.x
- esbuild bundle (ESM, treeShaking enabled)

## Reproduce

1. Install dependencies:

```bash
npm install
```

2. Run failing isolated scenario:

```bash
npm run repro:fail
```

Expected output includes:

```text
The "@fastify/static" package is missing. Please, make sure to install it to use SwaggerModule.
Result: FAIL
```

3. Run passing isolated scenario (copies `@fastify/static` dependency closure into runtime `node_modules`):

```bash
npm run repro:pass
```

Expected output includes:

```text
Bootstrap success
Result: PASS
```

## Notes

- `src/main.ts` includes an explicit side-effect import of `@fastify/static`.
- The bundle still fails in an isolated runtime unless `@fastify/static` and transitive dependencies are physically present.
- This appears related to runtime loading in `@nestjs/swagger` Fastify path.
