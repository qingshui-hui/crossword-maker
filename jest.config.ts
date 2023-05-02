import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts'
  ],
	reporters:
	[
		'<rootDir>/tests/reporter.js',
	],
}

export default config
