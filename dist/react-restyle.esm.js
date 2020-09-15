import { forwardRef, createElement } from 'react';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function isStyleMap(styles) {
  var maybeMap = styles;
  return (maybeMap === null || maybeMap === void 0 ? void 0 : maybeMap.isStyleMap) === true;
}

function createStyleMap(styles) {
  return _extends({
    isStyleMap: true
  }, styles);
}

function composeStyles(defaultStyles, props) {
  var _classes, _styles;

  var rootKey = defaultStyles.rootKey || 'root';
  var className = props.className,
      style = props.style;
  var classes;
  if (typeof defaultStyles.classes === 'string') classes = (_classes = {}, _classes[rootKey] = defaultStyles.classes, _classes);else classes = _extends({}, defaultStyles.classes);
  if (typeof className === 'string') classes[rootKey] = className;else if (className) Object.assign(classes, className); // use a string wrapper object for backward-compatibility with the
  // standard className prop (`String` is coerced to `string`)
  // eslint-disable-next-line no-new-wrappers

  var classNames = new String(classes[rootKey] || '');
  Object.assign(classNames, classes);
  var styles;
  if (isStyleMap(defaultStyles.styles)) styles = _extends({}, defaultStyles.styles);else styles = (_styles = {}, _styles[rootKey] = _extends({}, defaultStyles.styles), _styles);
  if (isStyleMap(style)) Object.assign(styles, style);else if (style) styles[rootKey] = style;
  return {
    className: classNames,
    style: styles
  };
}

function withStyles(Component, defaultStyles) {
  var forwardRef$1 = forwardRef(function (props, ref) {
    if (!forwardRef$1.defaultStyles) {
      forwardRef$1.defaultStyles = defaultStyles;
    }

    var _composeStyles = composeStyles(forwardRef$1.defaultStyles, props),
        className = _composeStyles.className,
        style = _composeStyles.style;

    return createElement(Component, Object.assign({}, props, {
      ref: ref,
      className: className,
      style: style
    }));
  });
  forwardRef$1.displayName = Component.displayName || Component.name;
  forwardRef$1.defaultStyles = defaultStyles;
  return forwardRef$1;
}

function removeClass(classes, remove) {
  if (typeof remove === 'string') remove = remove.split(' ');
  return classes.split(' ').filter(function (c) {
    return !remove.includes(c);
  }).join(' ') + ' ';
}

export { composeStyles, createStyleMap, removeClass, withStyles };
//# sourceMappingURL=react-restyle.esm.js.map
