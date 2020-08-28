import * as React from "react";
import {ClassName, composeStyles} from "../src";

const defaultStyles = {
    classes: {
        root: 'bg-white border padding margin-sm inline-block',
        hey: 'caps',
        punctuation: 'large bold'
    },
}

function HeyButton(props: React.PropsWithChildren<{ className?: ClassName, style?: React.CSSProperties }>) {
    const {className, style} = composeStyles(HeyButton.defaultStyles, props)
    return (
        <button className={className.root} style={style.root}>
            <span className={className.hey} style={style.hey}>
                hey&nbsp;
            </span>
            {props.children || '<SALUTATION>'}
            <span className={className.punctuation} style={style.punctuation}>!</span>
        </button>
    )
}

HeyButton.defaultStyles = defaultStyles

export default HeyButton
