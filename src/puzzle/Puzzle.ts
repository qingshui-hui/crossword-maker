import { AnnotatedPoint, CharPoint, relpoint } from "./Point";
import { PuzzleConfig } from "./PuzzleConfig";
import _, { Dictionary } from "lodash";
import { WordsNotAdjacentRule } from "./Rules";

class Puzzle {
    /**
     * 
     * @param chars represents the solution characters and empty spaces in the rectangular puzzle.  
     * a single array is used, and represents multiple lines of data, like a bitmap.  
     * the space character represents an empty field, other characters represent themselves
     * @param config the size of the puzzle
     * @param words contains all words that are part of the puzzle.  
     * note: words CAN contain spaces as well.
     */
    constructor(
        public readonly chars: string[],
        public readonly config: PuzzleConfig,
        public readonly words: string[]
    ) { }

    /** 
     * calculate the density of this puzzle.
     * this is the sum of the length of all words in the puzzle, and
     * used to select the best puzzle out of many randomly generated ones. 
     */
    get density(): number {
        let letters = 0
        this.words.forEach((word) => {
            letters += word.length
        })
        return letters / this.chars.length
    }

    /** 
     * for each character available in the puzzle (= Char key), calculates possible locations (= Array[CharPoint])
     * where additional words could be attached to the puzzle
     */
    get positions(): Dictionary<CharPoint[]> {
        const list: CharPoint[] = []
        this.chars.forEach((char, index) => {
            if (char === ' ') return

            const x = index % this.config.width
            const y = Math.floor(index / this.config.width)

            for (let vertical of [false, true]) {
                if (
                    this.isEmpty(...relpoint(x, y, -1, 0, vertical)) &&
                    (
                        !this.config.rules.includes(WordsNotAdjacentRule.id) ||
                        WordsNotAdjacentRule.positionOk(this, x, y, vertical)
                    )
                ) {
                    list.push(new CharPoint(char, x, y, vertical))
                    // TODO breakする必要があるか確認
                    break
                }
            }
        })
        return _.groupBy(list, cp => cp.char)
    }

    /** 
     * add the given word to the puzzle at the given location, and return a modified copy of the puzzle
     * @param vertical true if the word should be attached vertically (downward from the x/y location),
     *                 false if horizontally (to the right from the x/y location)
     * @param word the word to add to the puzzle 
     */
    copyWithWord(x: number, y: number, vertical: boolean, word: string): Puzzle {
        const newChars = [...this.chars]
        _.forEach(word, (char, index) => {
            newChars[this.toIndex(...relpoint(x, y, +index, 0, vertical))] = char
        })
        return new Puzzle(
            newChars,
            this.config,
            [...this.words, word])
    }

    private toIndex(x: number, y: number): number {
        // xに幅以下の負の数が来る場合も考慮する
        return (x + this.config.width) % this.config.width
            + y * this.config.width
    }

    getChar(x: number, y: number): string {
        if (y < 0 || y >= this.config.height
            || (x < 0 || x >= this.config.width)
        ) {
            // 範囲外の場合は空文字を返却
            return ' '
        }
        return this.chars[this.toIndex(x, y)]
    }

    isEmpty(x: number, y: number): boolean {
        return this.getChar(x, y) === ' '
    }

    /** 
     * tries to add the given word to the puzzle
     * @return array representing all possible variations of adding the word to the puzzle 
     */
    addWord(word: string): Puzzle[] {
        // console.debug('adding word', word)
        const puzzles: Puzzle[] = []
        const handleElement = (
            index: number,
            point: CharPoint
        ) => {
            const [x, y] = relpoint(point.x, point.y, - index, 0, point.vertical)
            const [r, b] = relpoint(point.x, point.y, - index + word.length - 1, 0, point.vertical)

            if (x >= 0 && y >= 0
                && b < this.config.height && r < this.config.width
                && this.fits(word, point.vertical, x, y)
            ) {
                puzzles.push(this.copyWithWord(x, y, point.vertical, word))
            }
        }
        const charIndices: { [key: string]: number[] } = {}
        _.forEach(word, (char, index) => {
            if (char in charIndices) {
                charIndices[char].push(index)
            } else {
                charIndices[char] = [index]
            }
        })

        // begin loop
        for (const [char, indices] of Object.entries(charIndices)) {
            const positions = _.get(this.positions, char)
            if (_.isEmpty(positions)) {
                continue
            }
            for (const point of positions) {
                for (const index of indices) {
                    handleElement(index, point)
                }
            }
        }
        return puzzles
    }

    private fits(word: string, vertical: boolean, x: number, y: number): boolean {
        let connect = false

        const sameCharOk = _.every(_.range(word.length).map(index => {
            const [locX, locY] = relpoint(x, y, +index, 0, vertical)

            const existingChar = this.getChar(locX, locY)

            const same = existingChar === word[index]
            const isEmpty = existingChar === ' '

            // 一か所でもつながる場所があれば、接続チェックOK
            if (same) connect = true

            let ruleCheck = true
            if (this.config.rules.includes(WordsNotAdjacentRule.id)) {
                // 空の場合は、両端のマスをチェックする
                if (isEmpty && !WordsNotAdjacentRule.fitCellOk(this, x, y, vertical)) {
                    ruleCheck = false
                }
            }

            return (same || isEmpty) && ruleCheck
        }))

        // 単語の両端をチェック
        // TODO positionsの方で行ってもよいかも
        // 🔳🔳🔳🔳
        // 🔵あいう🔵
        // 🔳🔳🔳🔳
        const edgeOk = (
            this.isEmpty(...relpoint(x, y, -1, 0, vertical))
            && this.isEmpty(...relpoint(x, y, word.length, 0, vertical)))

        return connect && sameCharOk && edgeOk
    }

    /** 
     * @return a simple text representation of the crossword puzzle, for debugging 
     */
    public toString = (): string => {
        let board = ''
        this.chars.forEach((char, index) => {
            if (index % this.config.width === 0) {
                board += '\n'
            }
            board += char === ' ' ? '🔳' : char
        })
        return board
    }
}

class PuzzleManager {

    /** @return an empty puzzle of the given size */
    static empty(config: PuzzleConfig): Puzzle {
        const chars = _.fill(Array(config.width * config.height), ' ')
        return new Puzzle(chars, config, [])
    }

    /**
     * @return randomly generated puzzles using the given word list and configuration
     * @param initialWord the word that should be used as the basis for the puzzle
     * @param list more words that should be added to the puzzle. not all words are guaranteed to be used, depending on size
     * @param config size of the puzzle 
     */
    static generate(initialWord: string, list: string[], config: PuzzleConfig): Puzzle[] {
        const emptyPuzzle = this.empty(config)
        const puzzles = [
            this.initial(emptyPuzzle, initialWord, false),
            this.initial(emptyPuzzle, initialWord, true),
        ]
        return puzzles.map(p => this.generateAndFinalize(p, list))
    }

    /** completes a puzzle by adding words to the given puzzle.
     * @param puzzle the existing puzzle that should be used as a basis. words will be added to this and a modified copy returned.
     * @param words more words that should be added to the puzzle. not all words are guaranteed to be used, depending on size */
    private static generateAndFinalize(puzzle: Puzzle, words: string[]): Puzzle {
        let basePuzzle = puzzle
        let finalPuzzle = this._generate(basePuzzle, words, [])

        while (finalPuzzle.words.length > basePuzzle.words.length) {
            basePuzzle = finalPuzzle
            finalPuzzle = this._generate(basePuzzle, words, [])
        }
        return finalPuzzle
    }

    /** create a puzzle with only a single word in it, with the given orientation and alignment.
     * @param emptyPuzzle empty puzzle that is used as basis.
     * @param word the initial word that should be added
     * @param vertical true if the word should be added vertically, otherwise horizontally
     * @param center true if the word should be centered, otherwise it is placed randomly in the puzzle */
    private static initial(emptyPuzzle: Puzzle, word: string, vertical: boolean): Puzzle {
        if (vertical) {
            return emptyPuzzle.copyWithWord(
                _.random(emptyPuzzle.config.width - 1),
                _.random(emptyPuzzle.config.height - word.length),
                vertical,
                word
            )
        } else {
            return emptyPuzzle.copyWithWord(
                _.random(emptyPuzzle.config.width - word.length),
                _.random(emptyPuzzle.config.height - 1),
                vertical,
                word
            )
        }
    }

    /** 
     * uses the given word list to try to fill remaining gaps in the puzzle
     * @param puzzle the puzzle for which we want to fill any gaps with additional words
     * @param words a long list (dictionary) of words that should be used to fill any gaps.
     *              for performance, not all words will be used if the list is very large 
     */
    // finalize(puzzle: Puzzle, words: string[]): Puzzle {
    //     const sorted = _.sortBy(_.shuffle(words).slice(0, 1000), w => - w.length)
    // }

    /** uses the given word list to try to fill remaining gaps in the puzzle
     * @param puzzle the puzzle for which we want to fill any gaps with additional words
     * @param words a list of words that should be used to fill any gaps
     * @param tried list of words that were already tried, but could not be added to the puzzle 
     */
    private static _generate(puzzle: Puzzle, words: string[], tried: string[]): Puzzle {
        // 末尾再帰
        // https://zenn.dev/kj455/articles/dfa23c8357b274
        if (_.isEmpty(words)) {
            return puzzle
        } else {
            const head = words[0]
            const tail = words.slice(1)

            if (puzzle.words.includes(head)) {
                return this._generate(puzzle, tail, tried)
            }
            const options = puzzle.addWord(head)
            if (_.isEmpty(options)) {
                return this._generate(puzzle, tail, [head, ...tried])
            }
            const nextPuzzle = options[_.random(options.length - 1)]

            return this._generate(nextPuzzle, [...tried, ...tail], [])
        }
    }
}

export {
    Puzzle,
    PuzzleManager
}
