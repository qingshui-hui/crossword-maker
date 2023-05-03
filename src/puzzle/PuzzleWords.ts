import { countBy, map, sum, sortBy } from 'lodash-es'

class PuzzleWords {

    /** @return sort the given words, such that the words with the most common characters are first.
     *          this is the most efficient way of incrementally adding words to a puzzle. */
    static sortByBest(words: string[]): string[] {
        const allChars = words.join('').split('')
        const frequency = countBy(allChars, c => c)

        // 他の単語と一致する文字がない場合は0になる
        const rateWord = (word: string) =>
            sum(map(word, c => frequency[c])) - word.length

        // console.debug('word rates', words.map(rateWord))
        return sortBy(words, rateWord).reverse()
    }
}

export {
    PuzzleWords
}
