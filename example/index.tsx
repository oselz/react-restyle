import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'normalize.css'
import './index.css'

import {removeClass} from "../src";
import HeyButton from "./HeyButton";
import NameBadge from "./NameBadge";
import Card from "./Card";

const App = () => {
    return (
        <Card className={{root: Card.defaultStyles.classes + ' bg-grey'}}>
            <ol>
                <li>
                    <HeyButton />
                    <NameBadge name='Jude'/>
                </li>
                <li>
                    <HeyButton>
                        <NameBadge name='Jude'/>
                    </HeyButton>
                </li>
                <li>
                    <HeyButton className={{root: undefined, hey: undefined, punctuation: undefined }}>
                        <NameBadge name='Jude' className='' style={{'color': undefined }}/>
                    </HeyButton>
                </li>
                <li>
                    <HeyButton className={{
                        root: removeClass(HeyButton.defaultStyles.classes.root, 'padding bg-white') +
                            'bg-blue white padding-sm sans',
                        hey: 'capitalize',
                        punctuation: removeClass(HeyButton.defaultStyles.classes.punctuation, 'large')
                    }}>
                        <NameBadge name='Jude' className='' style={{'color': undefined, display: 'inline'}}/>
                    </HeyButton>
                </li>
            </ol>
        </Card>
    );
};

ReactDOM.render(<App/>, document.getElementById('root'));
