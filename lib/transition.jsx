import React from 'react';

import Promise from 'bluebird';
import classNames from 'classnames';
import { Set } from 'immutable';
import curry from 'lodash.curry';

import TransitionChild from 'lib/transition-child';
import Component from 'utils/component';

export default class Transition extends Component {
    state = { children: [] };

    leavingChildren = [];
    enteringChildren = [];
    enteringChildrenIterim = [];

    // childrenBuilder(child) {
    //     return (
    //         <TransitionChild
    //             onBeforeEnter={this.props.onBeforeEnter}
    //             onAfterEnter={this.props.onAfterEnter}
    //             onBeforeLeave={this.props.onBeforeLeave}
    //             onAfterLeave={this.props.onAfterLeave}
    //             key={child.key}
    //         >
    //             {React.cloneElement(child.node, {
    //                 className: classNames(
    //                     child.node.props.className,
    //                     ...child.className.toJS()
    //                 ),
    //             })}
    //         </TransitionChild>
    //     );
    // }

    childrenBuilder(child) {
        const { node, key } = child;
        const { className, ...props } = child.props;

        return React.cloneElement(
            node,
            Object.assign(
                {
                    key,
                    className: classNames(
                        className.toJS(),
                        node.props.className
                    ),
                },
                props
            )
        );
    }

    /*getChildForKey(children, key) {
        for (const i in children) {

            if (children[i].key === key) return children[i];
        }

        return null;
    }

    findChildIndexByKey(children, key) {
        for (const i in children) {
            if (children[i].key == key) return i;
        }

        return -1;
    }

    updateChild = curry((key, nextChild, callback = null) => {
        this.setState(prevState => {
            const { children } = prevState;
            const index = this.findChildIndexByKey(children, key);
            const prevChild = children[index];

            children[index] = Object.assign({}, prevChild, nextChild);

            return { children };
        }, callback);
    })

    removeChild(key, callback) {
        this.setState(prevState => {
            const children = prevState.children;
            const index = this.findChildIndexByKey(children, key);

            if (index > -1) children.splice(index, 1);

            return { children };
        }, callback);
    }

    initiateEnteringChildren() {
        this.state.children
            .filter(child => child.state === 'entering')
            .map(child => {
                const updateChild = this.updateChild(child.key);

                child.state = null;
                updateChild(child);


                clearTimeout(child.timeout);
                child.timeout = null;
                child.className = child.className.clear().add('entering');
                updateChild(child);

                Promise.all([ this.props.onBeforeEnter() ])
                    .then(() => {
                        child.className = child.className.add('entering-active');

                        child.timeout = setTimeout(() => {
                            child.className = child.className.clear();

                            updateChild(child, () => {
                                this.props.onAfterEnter();
                            });
                        }, 1000);

                        updateChild(child);
                    });
            });
    }

    initiateLeavingChildren() {
        this.state.children
            .filter(child => child.state === 'leaving')
            .map(child => {
                const updateChild = this.updateChild(child.key);

                child.state = null;
                updateChild(child);

                clearTimeout(child.timeout);
                child.timeout = null;
                child.className = child.className.clear().add('leaving');
                updateChild(child);

                Promise.all([ this.props.onBeforeLeave() ])
                    .then(() => {
                        child.className = child.className.add('leaving-active');

                        child.timeout = setTimeout(() => {
                            child.className = child.className.clear();

                            this.removeChild(child.key, this.props.onAfterLeave);
                        }, 1000);

                        updateChild(child);
                    });
            });
    }

    mergeChildren(prevChildren = [], nextChildren) {
        // set all prevChildren as 'leaving' state
        prevChildren.map(prevChild => prevChild.state = 'leaving');
        React.Children.map(nextChildren, nextChild => {
            const child = this.getChildForKey(prevChildren, nextChild.key);

            if (child) {
                child.state = null;
            } else {
                prevChildren.push({
                    state: 'entering',
                    node: nextChild,
                    key: nextChild.key,
                    className: new Set(),
                    timeout: null,
                });
            }
        });

        return prevChildren;
    }*/

    findChildFromKey(children, key) {
        for (const index in children) {
            if (children[index].key == key) return children[index];
        }

        return false;
    }

    makeUpdateProps = curry((key, nextProps, callback = null) => {
        this.setState(state => {
            const children = Object.assign([], state.children);

            const child = this.findChildFromKey(children, key);

            Object.assign(
                child.props,
                typeof nextProps === 'function'
                    ? nextProps(child.props)
                    : nextProps
            );

            return { children };
        }, callback);
    });

    initiateEnteringChildren() {
        if (!this.enteringChildren.length) return false;

        const enteringChildren = Object.assign([], this.enteringChildren);
        this.enteringChildren = [];

        enteringChildren.map(async child => {
            const updateProps = this.makeUpdateProps(child.key);

            this.enteringChildrenIterim[child.key] = child;

            await this.props.onBeforeEnter();

            this.setState(
                ({ children }) => ({ children: children.concat(child) }),
                () => {
                    delete this.enteringChildrenIterim[child.key];

                    updateProps(props => ({
                        className: new Set(['entering']),
                    }));

                    setTimeout(() => {
                        updateProps(({ className }) => ({
                            className: className.add('entering-active'),
                        }));

                        setTimeout(() => {
                            updateProps({ className: new Set() });

                            this.props.onAfterEnter();
                        }, 1000);
                    });
                }
            );
        });
    }

    initiateLeavingChildren() {
        if (!this.leavingChildren.length) return false;

        const leavingChildren = this.leavingChildren;
        this.leavingChildren = [];

        leavingChildren.map(async child => {
            await this.props.onBeforeLeave();

            const isKeyNotExist = this.makeKeyNotExist([child]);

            this.setState(
                ({ children }) => ({
                    children: children.filter(isKeyNotExist),
                }),
                () => {
                    this.props.onAfterLeave();
                }
            );
        });
    }

    makeKeyNotExist(children) {
        const keys = children.map(({ key }) => key);

        return child => !keys.includes(child.key);
    }

    mergeChildren(prevChildren = [], nextChildren = []) {
        const isPrevKeyNotExist = this.makeKeyNotExist(prevChildren);
        const isNextKeyNotExist = this.makeKeyNotExist(nextChildren);

        this.enteringChildren = this.enteringChildren.concat(
            nextChildren.filter(isPrevKeyNotExist).map(child => ({
                key: child.key,
                node: child,
                props: { className: new Set() },
            }))
        );

        this.leavingChildren = this.leavingChildren.concat(
            prevChildren.filter(isNextKeyNotExist)
        );
    }

    componentWillReceiveProps(nextProps) {
        const existingChildren = this.state.children
            .concat(this.enteringChildren)
            .concat(this.enteringChildrenIterim);

        this.mergeChildren(existingChildren, nextProps.children);
    }

    componentDidUpdate() {
        // Children lifecycles
        this.initiateEnteringChildren();
        this.initiateLeavingChildren();
    }

    render() {
        return (
            <div>
                {this.state.children.map(this.childrenBuilder)}
            </div>
        );
    }
}
