
/**
 * 横方向の場合のみ座標を考えれば、縦方向の場合も算出できるようにするための関数。
 * 使用箇所を見るときには、xとyの部分は読み飛ばして、dxとdyの部分に注意を払うようにする。
 * @return 数値2つのタプル
 */
function relpoint(x: number, y: number, dx = 0, dy = 0, vertical = false): [number, number] {
    if (vertical) {
        return [x + dy, y + dx]
    } else {
        return [x + dx, y + dy]
    }
}


/** a point with x and y coordinates.coordinates */
class Point {

    constructor(
        public x: number,
        public y: number
    ) {
        // 属性の定義と割り当てを自動で行える
    }
}

/** represents a character at a specific point in the puzzle,
 *  for which there is enough space in the puzzle that another
 *  word can be attached to it either vertically or horizontally. 
 * @param vertical if true, a vertically aligned word can be attached to this character.
 *                 otherwise, a horizontally aligned word can be attached. */
class CharPoint {
    constructor(
        public readonly char: string,
        public readonly x: number,
        public readonly y: number,
        public readonly vertical: boolean,
    ) { }
}

/** the start of a word in the puzzle.
 * @param index the number of the word in the puzzle. the first word has index = 1.
 * @param vertical true if the word is oriented vertically in the puzzle, false if horizontally.
 * @param word the word that starts at the annotated position */
class AnnotatedPoint {
    constructor(
        public readonly index: number,
        public readonly vertical: boolean,
        public readonly word: string,
    ) { }
}

export {
    relpoint,
    Point,
    CharPoint,
    AnnotatedPoint
}
