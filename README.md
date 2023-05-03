# Crossword Maker

与えられた単語リストからクロスワードを生成するプログラムです。

## 使用例

```
const config = new PuzzleConfig(12, 12, false, [
  'WordsNotAdjacentRule'
])
const data = CrosswordGenerator.generate(words, config)

```

