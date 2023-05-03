
/** size and topology of the puzzle
 * @param width the number of horizontal characters in the puzzle
 * @param height the number of vertical characters in the puzzle
 * @param wrapping true if the puzzle should wrap around horizontally.
                   can be used for puzzles that wrap around e.g. a cylinder horizontally. */
class PuzzleConfig {
    constructor(
        public readonly width: number = 18,
        public readonly height: number = 18,
        public readonly wrapping: boolean = false,
        public readonly rules: string[] = []
    ) {}
}

export {
    PuzzleConfig
}
