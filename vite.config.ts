import { type ConfigEnv, defineConfig, loadEnv, type UserConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd())

  return {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@@': fileURLToPath(new URL('./app', import.meta.url)),
        '#': fileURLToPath(new URL('./types', import.meta.url)),
      },
    },
    server: {
      host: env.VITE_HOST ?? 'localhost',
      port: parseInt(env.VITE_PORT ?? '5100'),
      https: {
        key: fileURLToPath(new URL('./../../keys/jojotique-server.localhost-key.pem', import.meta.url)),
        cert: fileURLToPath(new URL('./../../keys/jojotique-server.localhost.pem', import.meta.url)),
      },
    },
    build: {
      sourcemap: true,
      lib: {
        entry: 'src/index.ts',
        name: 'Complete-rich-text-editor',
        fileName: 'complete-rich-text-editor',
      },
    },
  }
})
