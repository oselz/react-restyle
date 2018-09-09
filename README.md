# react-restyle

> Simple composable styling for React components.  Supports css-modules, BEM or just plain old css.

[![NPM](https://img.shields.io/npm/v/react-restyle.svg)](https://www.npmjs.com/package/react-restyle) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Why?

React-restyle is useful when you're stuck in classNames() hell.  You have a component that does a hundred and one things, takes two dozen style related props (half of which conflict) and is generally a mess.  Breaking the component out into composable parts is a nice way to clean up the mess, but targetting specific element styles from the outer components is tricky.  There are many many hacks to achieve a result, react-restyle is a slightly cleaner and more comprehensive one than most.

### What it's not.

A themeing engine for React that will make everything right in the world (and maybe cure cancer?).  If you want really pretty abstractions try [styled-components](https://www.styled-components.com/), or the hundred and one other styling methods.  If you just want something that works now, use react-restyle 😄.

## Install

```bash
npm install --save react-restyle
```

## Usage

react-restyle is designed to be clean and (relatively) low overhead.  There are no dependencies, and all information is contained in a single `prop` that is a plain old JavaScript object.  No higher-order-components, decorators or anything clever.  As a result it also works well with [Preact](https://preactjs.com/), or [Inferno](https://infernojs.org/)

The core is the [restyle](#restyle-object) prop which is passed from higher components down to lower level elements components.  The prop contains a simple mapping to add, replace, or remove classes.  It also supports injecting inline-styles on an element provided there is a reference key. Classes on elements can be targeted by their original name, or custom `{ key: 'className' }` mappings can be provided (useful for css-modules or complex cases).

A [compose](#compose) function is used to build the class and style props for the final element at rendering (example below).  ClassName and style can also be composed separately.  There is a [restyle](#restyle) helper function for quickly building the restyle prop.  The example below is deliberately verbose, in simple cases restyle could be just a single line.  Both compose and restyle are reasonably resilient, and can accept a range of className formats (including plains strings and Arrays of strings).

### Example

```jsx
import React from 'react'
import compose, {restyle} from 'react-restyle'

const Item = (props) => {
  let itemStyle = compose("item", { color: "red" }, props.restyle)
  let contentStyle = compose("content", props.restyle)
  return (
    <li {...itemStyle}>
       <span {...contentStyle}>{props.children}</span>
    </li>
  )
};

const FeatureItem = (props) => {
  let classMap = { item: "feature-item", content: "content content--red" }
  let styleMap = { content: { backgroundColor: "yellow" }}
  return <Item restyle={restyle(classMap, styleMap, props.restyle)} {...props}/>
};

const App = () => {
  return (
    <ul>
      <Item>Hello</Item>
      <FeatureItem>There!</FeatureItem>
    </ul>
  )
};
```

#### HTML Output
```html
<ul>
    <li class="item" style="color: red;">
        <span class="content">Hello</span>
    </li>
    <li class="feature-item" style="color: red;">
        <span class="content content--red" style="background-color: yellow;">There!</span>
    </li>
</ul>
```

Further information on each function is given below:

* [compose](#compose)
* [classNames](#classnames)
* [styles](#styles)
* [restyle](#restyle)
* [classMap](#classmap)
* [addClass](#addclass)
* [classMap (Object)](#classmap-object)
* [restyle (Object)](#restyle-object)

## compose

The main workhorse, composes the inherited styles over the component classes and styles.  By default new mappings in restyle replace existing classes, although new classes can also be added.  Refer to the [classMap](#classmap-object) for a detailed breakdown of the map.

**Parameters**

* `classMap` The classes to add to the element (with keys, if applicable)
* `style` A inline style object to apply to the element (optional)
* `restyle` A restyle prop to compose onto the classes and style (optional)

Returns **`{ className: string, style: Object }`**

## classNames

A sub-set of compose that returns `className` only, after composing `restyle` over `classMap`.  Behaves similar to the generic [classNames](https://github.com/JedWatson/classnames) utility.

**Parameters**

* `classMap` The component classes (or classMap)
* `restyle` An inherited restyle prop to compose over the classMap (optional)

Returns `className`

## styles

A sub-set of compose that returns `style` only, after composing `restyle` over `style` with reference to the keys in `classMap`.

**Parameters**

* `classMap` The classes (or keys) to select styles from restyle
* `style` A inline style object to apply to the element
* `restyle` An restyle prop to compose over style (optional)

Returns `className`

## restyle

Helper function for generating the restyle prop.

**Parameters**

* `classMap` The new class mapping, see [classMap (Object)](#classmap-object)
* `styleMap` A mapping for new inline styles (optional)
* `restyle` An inherited restyle prop (optional)

Returns `restyle`

## classMap

Helper function for generating classMaps using a cleaner 'classes' object

* `classes` An descriptive object of the new classes to map

**Example classes object:**

```js
let classes = {
    add: { keyOne: ['classOne', 'classOneA classOneB'], keyOneA: 'classOneC classOneD' },
    remap: { keyTwo: 'classTwo', keyTwoA: 'classTwoA classTwoB' },
    insert: { keyThree: { newKey: 'classThree' } },
    delete: ['keyFour']
  }
```

* add: adds a class to a key, for example
    - 'classOne classOneA classOneB' to elements matching keyOne
    - 'classOneC classOneD' to elements matching keyOneA
* remap: remaps (ie, replaces existing classes associated with a key), for example
    - elements matching keyTwo have classes replaced with 'classTwo'
    - elements matching keyTwoA have classes replaced with 'classTwoA classTwoB'
* insert: inserts a new key and class on elements with matching keys, for example
    - elements matching keyThree have newKey added along with 'classThree'
* delete: removes key (and any associated classes) from matching elements

Returns `classMap` for passing to restyle or compose.


## addClass

Helper function for generating a classMap when you just want to add a class or two:

**Parameters**

* `classes` The new classes to add in the form { targetClass: "newClass" }.  Will be expanded to { targetClass: { newClass: "newClass" }}

Returns `classMap` for passing to restyle or compose.

## classMap (Object)

The basic mapping for classNames (and keys).
* When used with [compose](#compose) classMap will result in all the contained keys and classes being assigned to the component. For example:

```JSX
const Item = (props) => {
    return <span {...compose({ item: "item-std", highlight: "bold" }, props.restyle)}>text</span>
}
```
will output html:
```html
<span class="item-std bold">Hello!</span>
```

The class _item-std_ remains associted with the key _item_ (and also class _bold_ with key _highlight_), which can be targetted from a higher component. Thus when used with [restyle](#restyle-object) classMap will remap any matching keys on the target compoent with the new mapping.  For example a higher component could target the span with a restyle of:

```JSX
const NewItem = (props) => {
    return <Item restyle={restyle({item: "item-new"})/>
}
```
which results in:
```html
<span class="item-new bold">Hello!</span>
```

**Example object:**

The classMap object (or more typically, Array) has five basic components:

```js
classMap = [
  'className', OR 'className anotherClassName', OR ['className', ...],
  {
    keyOne: ['className', ...], OR 'className anotherClassName',
    keyTwo: [{ keyThree: 'className' }],
    keyFour: '',
    keyFive: false
  }
];
```

Both [compose](#compose) and [restyle](#restyle) (and their helpers) are reasonably resilient and will accept simpler object structures, such as omitting Arrays, or joining strings.

1. Simple strings have an implicit key matching the class (ie 'myClass' is the same as `{ myClass: 'myClass' }`.
2. A basic `{ keyOne: 'className' }` mapping will on
    1. **compose**: track _keyOne_ and add _className_ to the element
    2. **restyle**: remap or elements containing _keyOne_ with _className_
3. Subsequent objects such as `{ keyTwo: [{ keyThree: 'className' }] }`,  will under
    1. **compose**: add the keyThree and className to the element, dropping _keyTwo_
    2. **restyle**: add new _keyThree_ and _className_ to all elements matching _keyTwo_
4. Keys containing empty strings will under
    1. **compose**: add the key for tracking, but not output a class
    2. **restyle**: remove any classes associate with the key, but leave the key for reference.
5. Keys with a _value_ of **false** will delete the key (if it exists) and any associated class under both compose and restyle.

There is also a helper function [classMap](#classmap) to simplify generating classMaps.

## restyle (Object)

Passed to child components to override styling.

**Parameters**

*`classMap` A class map for re-styling css classes
*`styleMap` A style map for defining inline-styles
*`compose` A restyle prop inherited from a higher component

**Example object:**

```js
restyle = {
  classMap: classMap,
  styleMap: {
    key: style,
  },
  compose: restyle
};

```

## Further Reading

If you're curious about other ways to tackle the same problem, there is extensive discussion on the issues below:

- [css-modules: Contextual Overrides / Theming Proposal](https://github.com/css-modules/css-modules/issues/147)
- [css-modules: Override child component styles (API suggestion)](https://github.com/css-modules/css-modules/issues/139)
- [styled-components: Per-component classnames discussion](https://github.com/styled-components/styled-components/pull/227)
- [styled-components: CSS Class Composition](https://github.com/styled-components/styled-components/issues/291)

## License

MIT © [Daniel Brownlees](https://github.com/oselnz)


