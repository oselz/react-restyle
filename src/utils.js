function classMapMerge (target, object, remap) {
  // merges object onto target (in place!)
  // remap.isFalsy: values are joined
  // remap.isTruthy: values are remapped
  for (let key in object) {
    if (object[key] === false) {
      // remove
      delete target[key]
    } else {
      let result = []
      for (let i = 0; i < object[key].length; i++) {
        let item = object[key][i]
        if (typeof (item) === 'object') {
          // add
          classMapMerge(target, item)
        } else {
          result.push(item)
        }
      }
      if (result.length) {
        if (!target.hasOwnProperty(key) || remap) {
          target[key] = result
        } else {
          // merge
          [].push.apply(target[key], result)
        }
      }
    }
  }
}

function formatItem (item) {
  if (Array.isArray(item)) {
    return item
  }
  if (typeof (item) === 'string') {
    return item.split(' ')
  }
  if (typeof (item) === 'number') {
    return [item.toString()]
  }
  if (typeof (item) === 'object') {
    return [formatObject(item)]
  }
}

function formatObject (object) {
  let result = {}

  for (let key in object) {
    if (!object.hasOwnProperty(key)) {
      continue
    }

    let value = object[key]

    if (value === false) {
      // keep so key gets dropped on merge
      result[key] = false
      continue
    }

    if (value === true) {
      // convert to key:value (ie, *add*)
      // deals with { 'classOne classTwo': true }
      Object.assign(result, stringToMap(key))
      continue
    }

    if (Array.isArray(value)) {
      let items = []
      for (let i = 0; i < value.length; i++) {
        [].push.apply(items, formatItem(value[i]))
      }
      result[key] = items
      continue
    }
    result[key] = formatItem(value)
  } // drop everything else

  return result
}

function formatMap (styleMap) {
  if (!styleMap) {
    return
  }

  // [true, ..] flags formatted Map, a dedicated property adds unwieldy
  // depth (or risks conflict with an actual mapping)
  if (Array.isArray(styleMap) && styleMap[0] === true) {
    return styleMap
  }

  const map = Array.isArray(styleMap) ? styleMap : [styleMap]
  let result = [true]

  for (let i = 0; i < map.length; i++) {
    if (Array.isArray(map[i])) {
      for (let j = 0; j < map[i].length; j++) {
        [].push.apply(result, formatItem(map[i][j]))
      }
    } else {
      [].push.apply(result, formatItem(map[i]))
    }
  } // drop everything else

  return result
}

function stringToMap (string) {
  // "classOne classTwo" or ["classOne", "classTwo"] >> { classOne: ['classOne'], classTwo: ['classTwo'] }
  let result = {}
  const classes = Array.isArray(string) ? string : string.split(' ')

  for (let i = 0; i < classes.length; i++) {
    result[classes[i]] = [classes[i]]
  }
  return result
}

export { classMapMerge, formatItem, formatMap, formatObject, stringToMap }
