import { Puzzle } from "./Puzzle";
import { relpoint } from "./Point";

/**
 * 単語非隣接
 */
class WordsNotAdjacentRule {
    static readonly id = 'WordsNotAdjacentRule'

    static positionOk(puzzle: Puzzle, x: number, y: number, vertical: boolean): boolean {
        if (vertical) {
            if (
                (
                    puzzle.isEmpty(...relpoint(x, y, +1, -1, vertical))
                    && puzzle.isEmpty(...relpoint(x, y, +1, +1, vertical))
                    && y < puzzle.config.height - 1
                ) || (
                    puzzle.isEmpty(...relpoint(x, y, -1, -1, vertical)) 
                    && puzzle.isEmpty(...relpoint(x, y, -1, +1, vertical)) 
                    && y > 0
                )
            ) {
                return true
            }
            return false
        } else {
            // 横のキー
            // 右端でない場合、「い」における条件
            // あ🔳
            // い
            // う🔳
            // 左端でない場合  場合、「い」における条件
            // 🔳あ
            // 　い
            // 🔳う
            if (
                (
                    puzzle.isEmpty(...relpoint(x, y, +1, -1, vertical))
                    && puzzle.isEmpty(...relpoint(x, y, +1, +1, vertical))
                    && x < puzzle.config.width - 1  // 右端でない場合
                ) || (
                    puzzle.isEmpty(...relpoint(x, y, -1, -1, vertical)) 
                    && puzzle.isEmpty(...relpoint(x, y, -1, +1, vertical)) 
                    && x > 0 // 左端でない場合             
                )) {
                return true
            }
            return false
        }
    }

    static fitCellOk(puzzle: Puzzle, x: number, y: number, vertical: boolean): boolean {
        // 上下のマスが空白であるか
        return puzzle.isEmpty(...relpoint(x, y, 0, -1, vertical)) 
            && puzzle.isEmpty(...relpoint(x, y, 0, +1, vertical))
    }
}

export {
    WordsNotAdjacentRule
}
