import React from 'react';

import { render } from 'react-dom';
import Promise from 'bluebird';
import uniqueId from 'lodash.uniqueId';
import autobind from 'react-autobind';

import { Transition } from 'dist';

class Test extends React.Component {
    state = { children: [] };

    constructor(props) {
        super(props);

        autobind(this);
    }

    componentDidMount() {
        console.log('Component: component did mount');

        for (let i = 0; i++ < 5; this.addItem());
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

        this.addItem();
    }

    addItem() {
        const { children } = this.state;
        const key = uniqueId();

        children.push(
            <div key={key} className="item">
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
                <div className="list">
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
            </div>
        );
    }
}

render(
    <div className="container">
        <Test />
    </div>,
    document.getElementById('main')
);
