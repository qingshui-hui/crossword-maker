import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts'
  ],
  reporters:
    [
      '<rootDir>/tests/reporter.cjs',
    ],
  // transform: {}
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!lodash-es)"
  ],
  // for jest
  // https://stackoverflow.com/a/54117206/20308611
  moduleNameMapper: {
    "^lodash-es$": "lodash"
  }
}

export default config
