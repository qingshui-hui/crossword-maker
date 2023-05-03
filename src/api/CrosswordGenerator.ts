import { maxBy, times } from "lodash-es"
import { Puzzle, PuzzleManager } from "../puzzle/Puzzle"
import { PuzzleConfig } from "../puzzle/PuzzleConfig"
import { minifyPuzzle, puzzleResponse } from "./responses"
import { WordsNotAdjacentRule } from "../puzzle/Rules"

class CrosswordGenerator {

    static generate(
        words: string[],
        config = new PuzzleConfig(12, 12, false, [
            WordsNotAdjacentRule.id,
        ])
    ) {
        let bestRating = 0.0
        let bestPuzzle: Puzzle | undefined

        times(1000, () => {
            const puzzles = PuzzleManager.generate(words[0], words.slice(1), config)
            const puzzle = maxBy(puzzles, p => p.density)
            if (!puzzle) {
                return
            }
            if (puzzle.density > bestRating) {
                bestRating = puzzle.density
                bestPuzzle = puzzle
            }
        })

        if (!bestPuzzle) {
            return
        }
        bestPuzzle = minifyPuzzle(bestPuzzle)
        return puzzleResponse(bestPuzzle, words)
    }
}

export {
    CrosswordGenerator
}
