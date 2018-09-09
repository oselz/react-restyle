import { formatItem, formatObject, formatMap, stringToMap, classMapMerge } from '../src/utils'

test('it splits string into array', () => {
  expect(formatItem('a b c')).toEqual(['a', 'b', 'c'])
  expect(formatItem(122)).toEqual(['122'])
  expect(formatItem({ a: 'b' })).toMatchObject([{ a: ['b'] }])
})

test('it converts a string to a map', () => {
  expect(stringToMap('one two three')).toMatchObject({ one: ['one'], two: ['two'], three: ['three'] })
})

test('it formats an object', () => {
  let testObj = {
    'one two': true,
    three: false,
    four: { five: 'six', seven: 'eight nine' },
    ten: '',
    eleven: 'twelve thirteen'
  }
  let result = {
    one: ['one'],
    two: ['two'],
    three: false,
    four: [{
      five: ['six'],
      seven: ['eight', 'nine']
    }],
    ten: [''],
    eleven: ['twelve', 'thirteen']
  }
  expect(formatObject(testObj)).toMatchObject(result)
})

test('it formats a map', () => {
  let testMap = [
    'one two',
    'three',
    {
      keyOne: 'four',
      keyTwo: 'five six',
      keyThree: ['seven', 'eight nine'],
      keyFour: {
        keyFive: 'ten eleven',
        keySix: ['twelve', 'thirteen fourteen']
      }
    },
    ['fifteen', 'sixteen seventeen'],
    {
      keySeven: false,
      keyEight: '',
      keyNine: true,
      'keyTen keyEleven': true
    }
  ]

  let resultMap = [
    true,
    'one',
    'two',
    'three',
    {
      keyOne: ['four'],
      keyTwo: ['five', 'six'],
      keyThree: ['seven', 'eight', 'nine'],
      keyFour: [{
        keyFive: ['ten', 'eleven'],
        keySix: ['twelve', 'thirteen', 'fourteen']
      }]
    },
    'fifteen',
    'sixteen',
    'seventeen',
    {
      keySeven: false,
      keyEight: [''],
      keyNine: ['keyNine'],
      keyTen: ['keyTen'],
      keyEleven: ['keyEleven']
    }
  ]
  expect(formatMap(testMap).sort()).toMatchObject(resultMap.sort())
})

test('it composes a classMap', () => {
  let targetMap = {
    a: ['b'],
    c: ['d', 'e'],
    f: [''],
    g: ['h']
  }

  let composeMap = {
    a: ['z'],
    f: ['y'],
    g: false
  }

  let resultMap = {
    a: ['z'],
    c: ['d', 'e'],
    f: ['y']
  }
  classMapMerge(targetMap, composeMap, true)
  expect(targetMap).toMatchObject(resultMap)
})

test('it adds a class on compose', () => {
  let targetMap = {
    a: ['b'],
    c: ['d']
  }
  let composeMap = {
    a: ['z'],
    c: [{ e: ['y'], f: ['vwx'], g: [''] }]
  }
  let resultMap = {
    a: ['z'],
    c: ['d'],
    e: ['y'],
    f: ['vwx'],
    g: ['']
  }
  classMapMerge(targetMap, composeMap, true)
  expect(targetMap).toMatchObject(resultMap)
})

test('it merges a classMap', () => {
  let targetMap = {
    a: ['b'],
    c: ['d', 'e'],
    f: [''],
    g: ['h']
  }

  let composeMap = {
    a: ['z'],
    f: ['y', 'x'],
    g: false
  }

  let resultMap = {
    a: ['b', 'z'],
    c: ['d', 'e'],
    f: ['', 'y', 'x']
  }
  classMapMerge(targetMap, composeMap)
  expect(targetMap).toMatchObject(resultMap)
})

test('it adds a class on merge', () => {
  let targetMap = {
    a: ['b'],
    c: ['d']
  }
  let composeMap = {
    a: ['z', { q: 'r' }], // later add here too
    c: [{ e: ['y'], f: ['vwx'], g: [''] }]
  }
  let resultMap = {
    a: ['b', 'z'],
    c: ['d'],
    e: ['y'],
    f: ['vwx'],
    g: [''],
    q: ['r']
  }
  classMapMerge(targetMap, composeMap)
  expect(targetMap).toMatchObject(resultMap)
})
