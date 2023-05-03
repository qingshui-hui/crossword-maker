import { maxBy, range } from "lodash-es"
import { Puzzle, PuzzleManager } from "../puzzle/Puzzle"
import { PuzzleConfig } from "../puzzle/PuzzleConfig"
import { minifyPuzzle, puzzleResponse } from "./responses"
import { PuzzleWords } from "../puzzle/PuzzleWords"

class CrosswordGenerator {

    static generate(
        words: string[],
        config = new PuzzleConfig(12, 12, [
            'WordsNotAdjacentRule',
        ])
    ) {
        let bestPuzzle = this.makeBestPuzzle(words, config)
        bestPuzzle = minifyPuzzle(bestPuzzle)
        return puzzleResponse(bestPuzzle, words)
    }

    static makeBestPuzzle(words: string[], config: PuzzleConfig): Puzzle {
        const sortedWords = PuzzleWords.sortByBest(words)

        let bestRating = 0.0
        let bestPuzzle: Puzzle | unknown = null

        for (const _ of range(1000)) {
            const puzzles = PuzzleManager.generate(sortedWords[0], sortedWords.slice(1), config)
            const puzzle = maxBy(puzzles, p => p.density) as Puzzle
            if (puzzle.density > bestRating) {
                bestRating = puzzle.density
                bestPuzzle = puzzle
            }
        }

        return bestPuzzle as Puzzle
    }
}

export {
    CrosswordGenerator
}
