import { defineConfig, devices } from '@playwright/test';

// A URL pode ser trocada sem editar o código: BASE_URL=https://outra-url npm test
const baseURL =
  process.env.BASE_URL ?? 'https://verzel-store.qa-test-verzel-store.workers.dev';

export default defineConfig({
  testDir: './tests',
  // Ambiente compartilhado com outros candidatos: execução sequencial e sem carga.
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    locale: 'pt-BR',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    // Testes de API: não abrem navegador.
    { name: 'api', testMatch: 'api/**/*.spec.ts' },
    // Testes de interface: Chromium.
    { name: 'e2e', testMatch: 'e2e/**/*.spec.ts', use: { ...devices['Desktop Chrome'] } },
  ],
});
