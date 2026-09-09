import { build } from 'esbuild';

await build({
  entryPoints: ['src/main.ts'],
  outfile: 'dist/index.mjs',
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node22',
  minify: true,
  treeShaking: true,
  sourcemap: true,
  tsconfig: 'tsconfig.json',
  external: [
    '@nestjs/platform-express',
    '@nestjs/microservices',
    '@nestjs/websockets',
    '@nestjs/platform-socket.io',
    '@fastify/view',
    'class-transformer',
    'class-validator',
    'mqtt',
    '@nats-io/transport-node',
    'ioredis',
    'amqp-connection-manager',
    'kafkajs'
  ],
  banner: {
    js: "import { createRequire } from 'module';import { fileURLToPath } from 'url';const require = createRequire(import.meta.url);const __dirname = import.meta.dirname;const __filename = fileURLToPath(import.meta.url);"
  }
});

console.log('Bundle written to dist/index.mjs');
