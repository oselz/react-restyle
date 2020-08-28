import * as React from "react";
import {withStyles, PropsWithStyles} from "../src";

const defaultStyles = {
    classes: 'border padding-sm margin-sm serif flex-col',
}

interface CardProps extends PropsWithStyles<{}>{}

class Card extends React.Component<CardProps> {
    render() {
        return (
            <div className={this.props.className?.root}>
                {this.props.children}
            </div>
        )
    }
}

export default withStyles(Card, defaultStyles)
