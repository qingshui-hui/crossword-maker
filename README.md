# Crossword Maker

与えられた単語リストからクロスワードを生成するプログラムです。

## 使用例

```
const config = new PuzzleConfig(12, 12, [
  'WordsNotAdjacentRule'
])
const data = CrosswordGenerator.generate(words, config)

```

## 生成されるクロスワードの例

### 密なパターン

![puzzle-dense](docs/resources/puzzle-1.png)


### 単語非隣接ルールを適用

![puzzle not adjacent](docs/resources/puzzle-2.png)
