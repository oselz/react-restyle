# react-restyle

> Simple composable styling for React components.  Supports css-in-jss, css-modules, BEM or just plain old css.

[![NPM](https://img.shields.io/npm/v/react-restyle.svg)](https://www.npmjs.com/package/react-restyle) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Why?

react-restyle provide composable styling for react components by allowing className (and style) to target and restyle elements inside the component, including the ability to remove or alter existing styling (so no more !important issues). Best of all there is no need for complex and fragile nested selectors!

Making a component restylable is transparent (ie, backward-compatible) to any component consumer, so code changes to introduce restyling are minimal.

## Install

```bash
npm install --save react-restyle
```

## Usage

### Quickstart

Define a restylable component with `defaultStyles` using the `withStyles` higher order component to automatically compose the styles (or the hook-like `composeStyles` can also be used):

```jsx
import * as React from "react";
import { withStyles} from "react-restyle";

const defaultStyles = {
    classes: {
        root: 'bg-red border padding-sm',
        text: 'white caps' 
     }
}

const NameBadge = ({className,style, name}) => {
    return (
        <div
            className={className.root /* or `className` also works for root elements */}
        >
            <span className={className.text}>{name}</span>
        </div>
    )
}

export default withStyles(NameBadge, defaultStyles)
```

Then simply restyle be expanding className to change the styling:

```jsx
const App = () => {
    return (
      <NameBadge className={{root: 'bg-green padding-lg', text: 'white'}}/>
    )
}
```

Passing a string to className still works fine, but will only change classes on the root component (ie, the fallback matches typical className usage):
```jsx
const App = () => {
    return (
      <NameBadge className='bg-green, padding-lg'/>
    )
}
```

### Example

The following is a simple example of combining two restylable components, `HeyButton` and `NameBadge` that both have inbuilt styling that would be diffcult to change with selectors.  Executable code is in [`example/`](example/).

1. The raw components:
    ```jsx
    <HeyButton />
    <NameBadge name='Jude'/>
    ```
   
2. Combining the components, they do not interface well.  Overriding the styles using a plain className prop would be limited as `!important`is present on several properties, along with inline styles too:
    ```jsx
    <HeyButton>
        <NameBadge name='Jude'/>
    </HeyButton>
    ```
   
3. Instead, as the components are restylable (and can very easily be made restylable if not, without notifying other component users) we can strip the un-needed styles by passing a targeted object for `className` and `style`:
    ```jsx
   <HeyButton className={{
       root: undefined, 
       hey: undefined, 
       punctuation: undefined 
   }}>
        <NameBadge name='Jude' className='' style={{'color': undefined }}/>
    </HeyButton>
    ```
   
4. Now we can style the object as required:
    ```jsx
    <HeyButton className={{
        root: 'border margin-sm bg-blue white padding-sm sans inline-block',
        hey: 'capitalize',
        punctuation: 'bold',
    }}>
        <NameBadge name='Jude' className='' style={{'color': undefined, display: 'inline'}}/>
    </HeyButton>
    ```
   
### API Reference
[`defaultStyles (Object)`](#defaultStyles)
: Definition object for base styles

[`withStyles`](#withStyles)
: Higher order component to automatically compose styles

[`composeStyles`](#composeStyles)
: Hook-like explicit composition of styles

[`removeClass`](#removeClass)
: Simple utility to remove a className from a list of classes


#### `defaultStyles`

Defines the base styles for the component.  By convention the outermost element is named `root` but the key can be any named property.

```js
const defaultStyles = {
    rootKey: 'root', // optional name for the root reference
    classes: { // mappings for element keys to css class names
        root: 'bg-blue d-flex',
        text: 'white',
    },
    styles: { // mappings for element keys to inline styles
        isStyleMap: true, // required key for object identificaiton
        root: {  
            display: 'inline-block',
        },
        text: {
            textTransform: 'uppercase',
        }
    }
}
```

##### Altering `defaultStyles`

By convention the defaultStyles object is saved to the component so consumers of the component can fetch the defaults for reference.

As a component consumer, altering `defaultStyles` itself will also change the default wherever the module is used.

### `withStyles`

Higher order component the automatically composes styling passed to the restylable component.

**Parameters**
* `Component` The restyleable component
* `defaultStyles` Base styles for the component

### `composeStyles`

Explicity composes the `className` and `style` from props over the base `defaultProps`.

**Parameters**
* `defaultStyles` Base styles for the component
* `props: {className, style}` The received props to compose

Returns an object containing the composed `props`, like so:
```js
const {className, style} = composeStyles(HeyButton.defaultStyles, props)
```

#### `composeStyles` Example

Note: By convention the defaultStyles object is added to the component to consumers of the component can fetch the defaults for reference or alter defaults.  `withStyles` will automatically add this, when manually composing styles the defaults need to be explicitly addded.

```jsx
import * as React from "react";
import {composeStyles} from "react-restyle";

const defaultStyles = {
    classes: {
        root: 'bg-white border padding margin-sm inline-block',
        hey: 'caps',
    },
}

function HeyButton(props) {
    const {className, style} = composeStyles(HeyButton.defaultStyles, props)
    return (
        <button className={className.root} style={style.root}>
            <span className={className.hey} style={style.hey}>
                hey&nbsp;
            </span>
            {props.children || '<SALUTATION>'}
        </button>
    )
}
HeyButton.defaultStyles = defaultStyles

export default HeyButton
```

#### `removeClass`

A utility to make altering existing classes on component cleaner:

**Parameters**

* `classes` The reference classes 
* `remove` String of space separated class names, or Array of classnames to remove from `classes`

Returns updated `classes` 

##### Examples

```js
removeClass('one two three four', 'one three') // returns 'two four'
```

```jsx
const PlainComponent = () => {
    // RedComponent has defaultStyles of {root: 'bg-red border d-flex'}
    return (
      <RedComponent className={{root: removeClass(SomeComponent.defaultStyles, 'bg-red')}}/>
    )
}
```

## License

MIT © [Daniel Brownlees](https://github.com/oselnz)


