/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  // Explicitly load plugins (required for pnpm strict node_modules)
  plugins: [
    '@stryker-mutator/vitest-runner'
  ],
  // Target only pure business logic files (high coverage from Phase 2)
  mutate: [
    'src/utilities/priceUtils.js',
    'src/utilities/usedProductsConfig.js',
    'src/store/states/shopping_cart.js',
    'src/store/states/product.js'
  ],
  testRunner: 'vitest',
  reporters: ['html', 'clear-text', 'progress'],
  htmlReporter: {
    fileName: 'reports/mutation/mutation-report.html'
  },
  coverageAnalysis: 'perTest',
  // Thresholds: fail if mutation score drops below 80%
  thresholds: {
    high: 90,
    low: 80,
    break: 75
  },
  timeoutMS: 10000,
  timeoutFactor: 2,
  concurrency: 4,
  tempDirName: '.stryker-tmp'
}

export default config
