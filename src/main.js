import { stringToMap, classMapMerge, formatMap, formatObject, formatItem } from './utils'

function compose (classMap, style, restyle) {
  let map = formatMap(classMap)

  let result = {}
  let classResult = {}
  let compose = restyle
  let styleResult = style || {}
  if (style && style.classMap) {
    // restyle was passed second
    compose = style
    styleResult = {}
  }

  // input map can only define classes (all keys)
  for (let i = 1; i < map.length; i++) {
    if (typeof (map[i]) === 'string') {
      classMapMerge(classResult, stringToMap(map[i]))
    } else if (typeof (map[i]) === 'object') {
      classMapMerge(classResult, map[i])
    }
  }

  while (compose) {
    // composed maps can redefine classes, but only if key exists
    let composeClassMap = formatMap(compose.classMap)
    if (composeClassMap) {
      for (let i = 1; i < composeClassMap.length; i++) {
        if (typeof (composeClassMap[i]) === 'string') {
          classMapMerge(classResult, stringToMap(composeClassMap[i]))
        } else {
          for (let key in classResult) {
            if (composeClassMap[i].hasOwnProperty(key)) {
              let composeObject = {}
              composeObject[key] = composeClassMap[i][key]
              classMapMerge(classResult, composeObject, true)
            }
          }
        }
      }
    }

    // style is composed sequentially (rather than separate from classes) so
    // dependent keys can be referenced correctly at each level
    let composeStyleMap = compose.styleMap
    if (composeStyleMap) {
      for (let key in classResult) {
        if (composeStyleMap.hasOwnProperty(key)) {
          Object.assign(styleResult, composeStyleMap[key])
        }
      }
    }

    compose = compose.compose
  }

  const classNames = [].concat.apply([], Object.values(classResult))
  result.className = classNames.join(' ')

  if (Object.keys(result).length !== 0) {
    result.style = styleResult
  }
  return result
}

function styles (classMap, style, restyle) {
  if (!restyle) {
    return style
  }
  return compose(classMap, style, restyle).style
}

function classNames (classMap, restyle) {
  return compose(classMap, null, restyle).className
}

function restyle (classMap, styleMap, restyle) {
  let result = {
    classMap: formatMap(classMap)
  }
  if (styleMap && styleMap.classMap) {
    // restyle was passed second
    result.compose = styleMap
  } else if (styleMap) {
    result.styleMap = styleMap
  }
  if (restyle) {
    result.compose = restyle
  }
  return result
}
function classMap (classes) {
  if (!classes) {
    return
  }
  let result = {}
  if (classes.add && typeof (classes.add) === 'object') {
    let obj = {}
    for (let key in classes.add) {
      let cls = classes.add[key]
      obj[key] = []
      if (typeof (cls) === 'string') {
        cls = [cls]
      }
      for (let i = 0; i < cls.length; i++) {
        [].push.apply(obj[key], formatItem(cls[i]))
      }
      if (result.hasOwnProperty(key)) {
        [].push.apply(result[key], obj)
      } else {
        result[key] = [obj]
      }
    }
  }
  if (classes.remap) {
    classMapMerge(result, formatObject(classes.remap, true))
  }
  if (classes.insert && typeof (classes.insert) === 'object') {
    for (var key in classes.insert) {
      let obj = formatObject(classes.insert[key])
      if (result.hasOwnProperty(key)) {
        [].push.apply(result[key], obj)
      } else {
        result[key] = [obj]
      }
    }
  }
  if (classes.delete && Array.isArray(classes.delete)) {
    for (let i = 0; i < classes.delete.length; i++) {
      result[classes.delete[i]] = false
    }
  }
  return [true, result]
}

function addClass (classes) {
  return classMap({ add: classes })
}


export { restyle, classMap, addClass, styles, classNames }
export default compose
