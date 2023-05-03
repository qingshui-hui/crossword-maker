import { WordsNotAdjacentRule } from "./Rules";

type ruleId = typeof WordsNotAdjacentRule.id

/** size and topology of the puzzle
 * @param width the number of horizontal characters in the puzzle
 * @param height the number of vertical characters in the puzzlecylinder horizontally. 
 */
class PuzzleConfig {
    constructor(
        public readonly width: number = 18,
        public readonly height: number = 18,
        public readonly rules: ruleId[] = []
    ) {}
}

export {
    PuzzleConfig
}
