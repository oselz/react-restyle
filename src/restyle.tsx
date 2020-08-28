import * as React from 'react';

export interface ClassMap {
    [key: string]: string | undefined;
}

export type ClassName = string | ClassMap;
type ClassNames = String & ClassMap;

export interface StyleMap {
    isStyleMap: boolean;
    [key: string]: React.CSSProperties | boolean;
}

function isStyleMap(
    styles?: StyleMap | React.CSSProperties
): styles is StyleMap {
    let maybeMap = styles as StyleMap;
    return maybeMap?.isStyleMap === true;
}

function createStyleMap(styles: Styles): StyleMap {
    return { isStyleMap: true, ...styles };
}

export type Style = React.CSSProperties | StyleMap;
type Styles = { [key: string]: React.CSSProperties };

export interface DefaultStyles {
    rootKey?: string;
    classes?: ClassMap | string;
    styles?: StyleMap | React.CSSProperties;
}

interface ComposedStyle {
    className: ClassNames;
    style: Styles;
}

function composeStyles(
    defaultStyles: DefaultStyles,
    props: { className?: ClassName; style?: Style }
): ComposedStyle {
    const rootKey = defaultStyles.rootKey || 'root';
    const { className, style } = props;

    let classes;
    if (typeof defaultStyles.classes === 'string')
        classes = { [rootKey]: defaultStyles.classes };
    else classes = { ...defaultStyles.classes };

    if (typeof className === 'string') classes[rootKey] = className;
    else if (className) Object.assign(classes, className);

    // use a string wrapper object for backward-compatibility with the
    // standard className prop (`String` is coerced to `string`)
    // eslint-disable-next-line no-new-wrappers
    let classNames = new String(classes[rootKey] || '') as ClassNames;
    Object.assign(classNames, classes);

    let styles;
    if (isStyleMap(defaultStyles.styles)) styles = { ...defaultStyles.styles };
    else styles = { [rootKey]: { ...defaultStyles.styles } };

    if (isStyleMap(style)) Object.assign(styles, style);
    else if (style) styles[rootKey] = style;

    return { className: classNames, style: styles as Styles };
}

export type PropsWithStyles<P> = P & { className?: ClassNames; style?: Styles };

export interface RestyleableComponent<P = any>
    extends React.ForwardRefExoticComponent<P & PropsWithStyles<P>> {
    defaultStyles: DefaultStyles;
}

function withStyles(
    Component: React.ComponentType,
    defaultStyles: DefaultStyles
) {
    const forwardRef: Partial<RestyleableComponent> = React.forwardRef(
        (props, ref) => {
            if (!forwardRef.defaultStyles) {
                forwardRef.defaultStyles = defaultStyles;
            }
            const { className, style } = composeStyles(
                forwardRef.defaultStyles,
                props
            );
            return (
                <Component
                    {...props}
                    ref={ref}
                    className={className}
                    style={style}
                />
            );
        }
    );
    forwardRef.displayName = Component.displayName || Component.name;
    forwardRef.defaultStyles = defaultStyles;
    return forwardRef as RestyleableComponent;
}

export { composeStyles, withStyles, createStyleMap };
