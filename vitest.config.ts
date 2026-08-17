import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        // Tests are pure-logic and clean up their own global state (e.g. clearSeed),
        // so we can skip per-file isolation. This lets each worker transform/import
        // the (large) shared module graph once instead of once per file, cutting the
        // fast suite from ~13s to ~9s. If a test ever gets flaky from leaked module
        // state, that's the first suspect.
        isolate: false,
        // forks is meaningfully faster than threads for this import-heavy suite.
        pool: 'forks',
    },
})
