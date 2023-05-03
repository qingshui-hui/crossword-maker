import { it } from '@jest/globals'
import { minifyPuzzle, puzzleResponse } from './responses'
import { CrosswordGenerator } from './CrosswordGenerator'
import { PuzzleConfig } from '../puzzle/PuzzleConfig'
import { PuzzleWords } from '../puzzle/PuzzleWords'

it('PuzzleWords', () => {
    const config = new PuzzleConfig(12, 12, [
        // WordsNotAdjacentRule.id,
    ])

    const words = PuzzleWords.sortByBest([
        'はくがい',
        'くつせつ',
        'いてん',
        'きかいか',
        'てあか',
        'みせばん',
        'うつし',
        'みうごき',
        'きぼ',
        'やとう',
        'いえす',
        'たか',
        'ばしや',
    ])
    const bestPuzzle = CrosswordGenerator.makeBestPuzzle(words, config)
    console.log(String(bestPuzzle))

    let unusedWords = [...words]
    bestPuzzle.words.forEach(word => {
        unusedWords = unusedWords.filter(w => w !== word)
    })
    console.log('未使用の単語', unusedWords)
    console.log(minifyPuzzle(bestPuzzle).toString())
    console.log(puzzleResponse(minifyPuzzle(bestPuzzle), words))
    // console.log(bestPuzzle.getAnnotation())
    // console.log(bestPuzzle.words)
    // console.log(puzzleResponse(bestPuzzle, words))
})
