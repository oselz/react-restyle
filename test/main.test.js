import compose, { restyle, classNames, styles, classMap, addClass } from '../src/main'

test('it composes restyle over style', () => {
  let classMap = {
    item: 'feature-item',
    content: 'content content--red',
    new: { highlight: 'highlight' }
  }
  let styleMap = {
    content: {
      backgroundColor: 'yellow'
    }
  }
  let restyleProp = restyle(classMap, styleMap, null)

  let itemStyle = {
    className: 'feature-item',
    style: { 'color': 'red' }
  }

  let contentStyle = {
    className: 'content content--red new highlight',
    style: { 'backgroundColor': 'yellow', 'color': 'green' }
  }
  expect(compose('item', { color: 'red' }, restyleProp)).toMatchObject(itemStyle)
  expect(compose('content new', { color: 'green' }, restyleProp)).toMatchObject(contentStyle)
})

test('it composes a series inline styles', () => {
  let testRestyle = {
    classMap: null,
    styleMap: {
      item: { color: 'red' }
    },
    compose: {
      classMap: null,
      styleMap: {
        item: { color: 'blue' }
      },
      compose: {
        classMap: null,
        styleMap: {
          item: { margin: '0' }
        },
        compose: {
          classMap: null,
          styleMap: {
            otherItem: { margin: '1em' }
          }
        }
      }
    }
  }

  let resultStyle = {
    backgroundColor: 'red',
    color: 'blue',
    margin: '0'
  }
  expect(compose('item', { backgroundColor: 'red' }, testRestyle).style).toMatchObject(resultStyle)
})

test('it adds a class', () => {
  let classMap = {
    item: ['item', { feature: 'feature-item' }],
    other: { dummy: 'class' }
  }
  let restyleProp = restyle(classMap)
  expect(classNames('item', restyleProp)).toBe('item feature-item')
})

test('it merges classnames', () => {
  // TODO: drop duplicates
  expect(classNames(['a', 'a b c', 'd', false, true, undefined])).toEqual('a a b c d')
})

test('it generates a restyle prop', () => {
  let classMap = {
    item: 'feature-item',
    content: 'content content--red'
  }
  let styleMap = {
    content: {
      backgroundColor: 'yellow'
    }
  }
  let prop = {
    classMap: [true, { content: ['content', 'content--red'], item: ['feature-item'] }],
    styleMap: { content: { backgroundColor: 'yellow' } },
    compose: true
  }
  expect(restyle(classMap, styleMap, true)).toMatchObject(prop)
})

test('it merges inline styles', () => {
  let classMap = {
    item: 'item'
  }
  let style = {
    backgroundColor: 'yellow',
    color: 'red'
  }
  let prop = {
    classMap: undefined,
    styleMap: { item: { backgroundColor: 'blue' } }
  }
  expect(styles(classMap, style, prop)).toMatchObject({ backgroundColor: 'blue', color: 'red' })
})

test('it builds a classMap', () => {
  let classes = {
    add: { keyOne: ['classOne', 'classOneA classOneB'], keyOneA: 'classOneC classOneD' },
    remap: { keyTwo: 'classTwo', keyTwoA: 'classTwoA classTwoB' },
    insert: { keyThree: { newKey: 'classThree' } },
    delete: ['keyFour']
  }
  let result = [
    true,
    {
      keyOne: [{ keyOne: ['classOne', 'classOneA', 'classOneB'] }],
      keyOneA: [{ keyOneA: ['classOneC', 'classOneD'] }],
      keyTwo: ['classTwo'],
      keyTwoA: ['classTwoA', 'classTwoB'],
      keyThree: [{ newKey: ['classThree'] }],
      keyFour: false
    }
  ]
  expect(classMap(classes)).toMatchObject(result)
})

test('it quickly adds a class', () => {
  let add = { keyOne: ['classOne', 'classOneA classOneB'], keyOneA: 'classOneC classOneD' }
  let result = [
    true,
    {
      keyOne: [{ keyOne: ['classOne', 'classOneA', 'classOneB'] }],
      keyOneA: [{ keyOneA: ['classOneC', 'classOneD'] }],
    }
  ]
  expect(addClass(add)).toMatchObject(result)
})
