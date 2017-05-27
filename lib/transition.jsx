import React from 'react';

import Promise from 'bluebird';
import classNames from 'classnames';
import { Set } from 'immutable';
import curry from 'lodash.curry';
import startCase from 'lodash.startcase';
import PropTypes from 'prop-types';

import TransitionChild from 'lib/transition-child';
import Component from 'utils/component';

export default class Transition extends Component {
    static defaultProps = {
        onBeforeAppear: () => null,
        onAfterAppear: () => null,
        onBeforeEnter: () => null,
        onAfterEnter: () => null,
        onBeforeLeave: () => null,
        onAfterLeave: () => null,
        transitionNames: {
            enter: 'enter',
            enterActive: 'enter-active',
            leave: 'leave',
            leaveActive: 'leave-active',
            appear: 'appear',
            appearActive: 'appear-active',
        },
    };

    static propTypes = {
        onBeforeAppear: PropTypes.func,
        onAfterAppear: PropTypes.func,
        onBeforeEnter: PropTypes.func,
        onAfterEnter: PropTypes.func,
        onBeforeLeave: PropTypes.func,
        onAfterLeave: PropTypes.func,
        transitionNames: PropTypes.object,
    };

    state = { children: [] };

    leavingChildren = [];
    enteringChildren = [];
    enteringChildrenIterim = [];
    transitionNames = {};

    hasAppeared = false;

    constructor(props) {
        super(props);

        this.initiateEnteringChildren = this.makeIntroChildren('enter');
        this.initiateAppearingChildren = this.makeIntroChildren('appear');

        this.updateTransitionNames(props.transitionNames);

        this.mergeChildren([], props.children);
    }

    updateTransitionNames(transitionNames = {}) {
        this.transitionNames = Object.assign(
            {},
            Transition.defaultProps.transitionNames,
            transitionNames
        );
    }

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

            // TODO: Bail of no child, but need to investigate further why this would not be finding the child
            if (!child) return false;

            Object.assign(
                child.props,
                typeof nextProps === 'function'
                    ? nextProps(child.props)
                    : nextProps
            );

            return { children };
        }, callback);
    });

    makeIntroChildren = curry(actionBaseName => {
        return () => {
            if (!this.enteringChildren.length) return false;

            const enteringChildren = Object.assign([], this.enteringChildren);
            this.enteringChildren = [];

            enteringChildren.map(async child => {
                const updateProps = this.makeUpdateProps(child.key);

                this.enteringChildrenIterim[child.key] = child;

                await this.props[`onBefore${startCase(actionBaseName)}`]();

                this.setState(
                    ({ children }) => ({ children: children.concat(child) }),
                    () => {
                        delete this.enteringChildrenIterim[child.key];

                        updateProps(props => ({
                            className: new Set([
                                this.transitionNames[actionBaseName],
                            ]),
                        }));

                        setTimeout(() => {
                            updateProps(({ className }) => ({
                                className: className.add(
                                    this.transitionNames[
                                        `${actionBaseName}Active`
                                    ]
                                ),
                            }));

                            setTimeout(() => {
                                updateProps({ className: new Set() });

                                this.props[
                                    `onAfter${startCase(actionBaseName)}`
                                ]();
                            }, 1000);
                        });
                    }
                );
            });
        };
    });

    initiateLeavingChildren() {
        if (!this.leavingChildren.length) return false;

        const leavingChildren = this.leavingChildren;
        this.leavingChildren = [];

        leavingChildren.map(async child => {
            const updateProps = this.makeUpdateProps(child.key);

            await this.props.onBeforeLeave();

            const isKeyNotExist = this.makeKeyNotExist([child]);

            updateProps(props => ({
                className: new Set([this.transitionNames.leave]),
            }));

            setTimeout(() => {
                updateProps(({ className }) => ({
                    className: className.add(this.transitionNames.leaveActive),
                }));

                setTimeout(() => {
                    updateProps({ className: new Set() });

                    this.setState(
                        ({ children }) => ({
                            children: children.filter(isKeyNotExist),
                        }),
                        this.props.onAfterEnter()
                    );
                }, 1000);
            });
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
        this.updateTransitionNames(nextProps.transitionNames);

        const existingChildren = this.state.children
            .concat(this.enteringChildren)
            .concat(this.enteringChildrenIterim);

        this.mergeChildren(existingChildren, nextProps.children);
    }

    componentDidUpdate() {
        // Children lifecycles

        if (!this.hasAppeared) {
            this.initiateAppearingChildren();
            this.hasAppeared = true;
        } else {
            this.initiateEnteringChildren();
        }

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
