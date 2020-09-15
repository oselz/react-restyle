import * as React from 'react';
export interface ClassMap {
    [key: string]: string | undefined;
}
export declare type ClassName = string | ClassMap;
declare type ClassNames = String & ClassMap;
export interface StyleMap {
    isStyleMap: boolean;
    [key: string]: React.CSSProperties | boolean;
}
declare function createStyleMap(styles: Styles): StyleMap;
export declare type Style = React.CSSProperties | StyleMap;
declare type Styles = {
    [key: string]: React.CSSProperties;
};
export interface DefaultStyles {
    rootKey?: string;
    classes?: ClassMap | string;
    styles?: StyleMap | React.CSSProperties;
}
interface ComposedStyle {
    className: ClassNames;
    style: Styles;
}
declare function composeStyles(defaultStyles: DefaultStyles, props: {
    className?: ClassName;
    style?: Style;
}): ComposedStyle;
export declare type PropsWithStyles<P> = P & {
    className?: ClassNames;
    style?: Styles;
};
export interface RestyleableComponent<P = any> extends React.ForwardRefExoticComponent<P & PropsWithStyles<P>> {
    defaultStyles: DefaultStyles;
}
declare function withStyles(Component: React.ComponentType, defaultStyles: DefaultStyles): RestyleableComponent<any>;
export { composeStyles, withStyles, createStyleMap };
