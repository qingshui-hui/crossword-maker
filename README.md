# Crossword Maker

与えられた単語リストからクロスワードを生成するプログラムです。

## Features

- [ESLint](https://eslint.org/) with [ESLint Recommended](https://github.com/eslint-recommended)
  - Run on Pull request by GitHub Actions
- Test by [Jest](https://jestjs.io/)
  - Run on Pull request by GitHub Actions
- Manage Node.js version by [nvm](https://github.com/nvm-sh/nvm)
- Manage dependency updates by [Renovate](https://renovatebot.com/)

## 使用例

```
const config = new PuzzleConfig(12, 12, false, [
  'WordsNotAdjacentRule'
])
const data = CrosswordGenerator.generate(words, config)

```
