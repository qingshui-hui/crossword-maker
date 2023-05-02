import _ from 'lodash'

class PuzzleWords {

    /** @return sort the given words, such that the words with the most common characters are first.
     *          this is the most efficient way of incrementally adding words to a puzzle. */
    static sortByBest(words: string[]): string[] {
        const allChars = words.join('').split('')
        const frequency = _.countBy(allChars, c => c)

        // 他の単語と一致する文字がない場合は0になる
        const rateWord = (word: string) => 
            _.sum(_.map(word, c => frequency[c])) - word.length

        // console.debug('word rates', words.map(rateWord))
        return _.sortBy(words, rateWord).reverse()
    }
}

export {
    PuzzleWords
}
