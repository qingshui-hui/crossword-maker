import { CrosswordGenerator, PuzzleConfig } from '../dist/index.js'

const words = [
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
]
console.log(CrosswordGenerator.generate(words))

import { groupBy } from 'lodash-es'
