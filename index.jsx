import React from 'react';

import { render } from 'react-dom';
import Promise from 'bluebird';
import uniqueId from 'lodash.uniqueId';

import Transition from 'lib/transition';
import Component from 'utils/component';

class Test extends Component {
    state = { children: [] };

    componentDidMount() {
        console.log('Component: component did mount');
    }

    componentWillUnmount() {
        console.log('Component: component did unmount');
    }

    removeChild(key) {
        const { children } = this.state;

        for (const i in children) {
            if (children[i].key == key) {
                children.splice(i, 1);
                this.setState({ children });

                break;
            }
        }
    }

    onClickHandler(e) {
        e.preventDefault();

        const { children } = this.state;
        const key = uniqueId();

        children.push(
            <div key={key} className={'list-item'}>
                {key}
                <button
                    onClick={e => {
                        e.preventDefault();
                        this.removeChild(key);
                    }}
                >
                    x
                </button>
            </div>
        );

        this.setState({ children });
    }

    onBeforeEnter() {
        console.log('onBeforeEnter');
        return new Promise(resolve => setTimeout(resolve, 1000));
    }

    onBeforeLeave() {
        console.log('onBeforeLeave');
        return new Promise(resolve => setTimeout(resolve, 1000));
    }

    render() {
        return (
            <div>
                <button onClick={this.onClickHandler}>Add</button>
                <Transition
                    onBeforeAppear={() => console.log('onBeforeAppear')}
                    onAfterAppear={() => console.log('onAfterAppear')}
                    onBeforeEnter={this.onBeforeEnter}
                    onAfterEnter={() => console.log('onAfterEnter')}
                    onBeforeLeave={this.onBeforeLeave}
                    onAfterLeave={() => console.log('onAfterLeave')}
                >
                    {this.state.children}
                </Transition>
            </div>
        );
    }
}

render(
    <div
        style={{
            maxWidth: 1200,
            margin: '0 auto',
        }}
    >
        <Test />
    </div>,
    document.getElementById('main')
);
