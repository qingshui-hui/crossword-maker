import { every, range } from "lodash-es";
import { Puzzle } from "../puzzle/Puzzle";
import { PuzzleConfig } from "../puzzle/PuzzleConfig";

function puzzleResponse(puzzle: Puzzle, inputWords: string[]) {
    // グリッド作成
    const grid: string[][] = []
    let row: string[] = []
    puzzle.chars.forEach((char, index) => {
        row.push(char === ' ' ? '-' : char)
        if (index % puzzle.config.width === puzzle.config.width - 1) {
            grid.push([...row])
            row = []
        }
    })

    // 問題の構造を作成
    const clueDataFormat: any = {
        across: {},
        down: {}
    }
    puzzle.getAnnotation().forEach(point => {
        if (point.vertical) {
            clueDataFormat.across[point.index] = {
                clue: point.word + 'のヒント',
                answer: point.word,
                row: point.y,
                col: point.x,
            }
        } else {
            clueDataFormat.down[point.index] = {
                clue: point.word + 'のヒント',
                answer: point.word,
                row: point.y,
                col: point.x,
            }
        }
    })

    // 未使用の単語
    let unusedWords = [...inputWords]
    puzzle.words.forEach(word => {
        unusedWords = unusedWords.filter(w => w !== word)
    })

    return {
        grid,
        wordList: clueDataFormat,
        unusedWords,
    }
}

function getMinPuzzleSqare(puzzle: Puzzle) {
    let startX = -1
    let stopX = puzzle.config.width
    for (const x of range(puzzle.config.width)) {
        const col = range(puzzle.config.height).map(
            y => puzzle.getChar(x, y)
        )
        if (startX === -1) {
            if (!every(col, c => c === ' ')) {
                startX = x
            }
        } else {
            if (every(col, c => c === ' ')) {
                stopX = x
                break
            }
        }
    }
    let startY = -1
    let stopY = puzzle.config.height
    for (const y of range(puzzle.config.height)) {
        const row = range(puzzle.config.width).map(
            x => puzzle.getChar(x, y)
        )
        if (startY === -1) {
            if (!every(row, c => c === ' ')) {
                startY = y
            }
        } else {
            if (every(row, c => c === ' ')) {
                stopY = y
                break
            }
        }
    }
    return { startX, stopX, startY, stopY }
}

function minifyPuzzle(puzzle: Puzzle): Puzzle {
    const { startX, stopX, startY, stopY } = getMinPuzzleSqare(puzzle)

    const newChars: string[] = []
    for (const y of range(startY, stopY)) {
        for (const x of range(startX, stopX)) {
            newChars.push(puzzle.getChar(x, y))
        }
    }

    const newConfig = new PuzzleConfig(
        stopX - startX,
        stopY - startY
    )

    return new Puzzle(newChars, newConfig, puzzle.words)
}

export {
    puzzleResponse,
    minifyPuzzle
}
