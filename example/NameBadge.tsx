import {PropsWithStyles, withStyles} from "../src";
import * as React from "react";

const defaultStyles = {
    classes: 'bg-red white border padding-sm caps',
    styles: {
        isStyleMap: true,
        root: {
            display: 'inline-block',
            color: 'yellow'
        },
        text: {
            textTransform: 'uppercase' as 'uppercase',
        }
    }
}

interface NameBadgeProps extends PropsWithStyles<{ name: string }>{}

const NameBadge: React.FunctionComponent<NameBadgeProps> = ({className,style, name}) => {
    return (
        <div
            className={className?.root /* or `className` (JS) / `className.valueOf()` (TS) */}
            style={style?.root}
        >
            <span className={className?.text}>{name}</span>
        </div>
    )
}

export default withStyles(NameBadge, defaultStyles)
