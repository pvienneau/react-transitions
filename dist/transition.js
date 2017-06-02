'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _immutable = require('immutable');

var _lodash = require('lodash.curry');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.upperfirst');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.camelcase');

var _lodash6 = _interopRequireDefault(_lodash5);

var _lodash7 = require('lodash.compose');

var _lodash8 = _interopRequireDefault(_lodash7);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactAutobind = require('react-autobind');

var _reactAutobind2 = _interopRequireDefault(_reactAutobind);

var _transitionChild = require('lib/transition-child');

var _transitionChild2 = _interopRequireDefault(_transitionChild);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var pascaleCase = (0, _lodash8.default)(_lodash4.default, _lodash6.default);

var Transition = function (_React$Component) {
    _inherits(Transition, _React$Component);

    function Transition(props) {
        var _this2 = this;

        _classCallCheck(this, Transition);

        var _this = _possibleConstructorReturn(this, (Transition.__proto__ || Object.getPrototypeOf(Transition)).call(this, props));

        _this.state = { children: [] };
        _this.leavingChildren = [];
        _this.enteringChildren = [];
        _this.enteringChildrenIterim = [];
        _this.transitionNames = {};
        _this.hasAppeared = false;
        _this.makeUpdateProps = (0, _lodash2.default)(function (key, nextProps) {
            var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            _this.setState(function (state) {
                var children = Object.assign([], state.children);

                var child = _this.findChildFromKey(children, key);

                // TODO: Bail if no child, but need to investigate further why this would not be finding the child
                if (!child) return false;

                Object.assign(child.props, typeof nextProps === 'function' ? nextProps(child.props) : nextProps);

                return { children: children };
            }, callback);
        });
        _this.makeIntroChildren = (0, _lodash2.default)(function (actionBaseName) {
            return function () {
                if (!_this.enteringChildren.length) return false;

                var enteringChildren = Object.assign([], _this.enteringChildren);
                _this.enteringChildren = [];

                _this.enteringChildrenIterim = enteringChildren;

                enteringChildren.map(function () {
                    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(child) {
                        var updateProps;
                        return regeneratorRuntime.wrap(function _callee$(_context) {
                            while (1) {
                                switch (_context.prev = _context.next) {
                                    case 0:
                                        _context.next = 2;
                                        return _this.props['onBefore' + pascaleCase(actionBaseName)]();

                                    case 2:
                                        if (_this.props['transition' + pascaleCase(actionBaseName)]) {
                                            _context.next = 4;
                                            break;
                                        }

                                        return _context.abrupt('return', _this.setState(function (_ref2) {
                                            var children = _ref2.children;
                                            return {
                                                children: children.concat(child)
                                            };
                                        }, function () {
                                            _this.props['onAfter' + pascaleCase(actionBaseName)]();
                                        }));

                                    case 4:
                                        updateProps = _this.makeUpdateProps(child.key);


                                        _this.setState(function (_ref3) {
                                            var children = _ref3.children;
                                            return { children: children.concat(child) };
                                        }, function () {
                                            delete _this.enteringChildrenIterim[child.key];

                                            updateProps(function (props) {
                                                return {
                                                    className: new _immutable.Set([_this.transitionNames[actionBaseName]])
                                                };
                                            });

                                            setTimeout(function () {
                                                updateProps(function (_ref4) {
                                                    var className = _ref4.className;
                                                    return {
                                                        className: className.add(_this.transitionNames[actionBaseName + 'Active'])
                                                    };
                                                });

                                                setTimeout(function () {
                                                    updateProps({ className: new _immutable.Set() });

                                                    _this.props['onAfter' + pascaleCase(actionBaseName)]();
                                                }, _this.props['transition' + pascaleCase(actionBaseName) + 'Timeout']);
                                            });
                                        });

                                    case 6:
                                    case 'end':
                                        return _context.stop();
                                }
                            }
                        }, _callee, _this2);
                    }));

                    return function (_x2) {
                        return _ref.apply(this, arguments);
                    };
                }());
            };
        });


        _this.initiateEnteringChildren = _this.makeIntroChildren('enter');
        _this.initiateAppearingChildren = _this.makeIntroChildren('appear');

        _this.updateTransitionNames(props.transitionNames);

        _this.mergeChildren([], props.children);

        (0, _reactAutobind2.default)(_this);
        return _this;
    }

    _createClass(Transition, [{
        key: 'updateTransitionNames',
        value: function updateTransitionNames() {
            var transitionNames = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            this.transitionNames = Object.assign({}, Transition.defaultProps.transitionNames, transitionNames);
        }
    }, {
        key: 'childrenBuilder',
        value: function childrenBuilder(child) {
            var node = child.node,
                key = child.key;

            var _child$props = child.props,
                className = _child$props.className,
                props = _objectWithoutProperties(_child$props, ['className']);

            return _react2.default.createElement(
                _transitionChild2.default,
                { key: key },
                _react2.default.cloneElement(node, Object.assign({
                    className: (0, _classnames2.default)(className.toJS(), node.props.className)
                }, props))
            );
        }
    }, {
        key: 'findChildFromKey',
        value: function findChildFromKey(children, key) {
            for (var index in children) {
                if (children[index].key == key) return children[index];
            }

            return false;
        }
    }, {
        key: 'initiateLeavingChildren',
        value: function initiateLeavingChildren(hasAnimate) {
            var _this3 = this;

            if (!this.leavingChildren.length) return false;

            var leavingChildren = this.leavingChildren;
            this.leavingChildren = [];

            leavingChildren.map(function () {
                var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(child) {
                    var isKeyNotExist, removeChildFromState, updateProps;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    _context2.next = 2;
                                    return _this3.props.onBeforeLeave();

                                case 2:
                                    isKeyNotExist = _this3.makeKeyNotExist([child]);

                                    removeChildFromState = function removeChildFromState() {
                                        _this3.setState(function (_ref6) {
                                            var children = _ref6.children;
                                            return {
                                                children: children.filter(isKeyNotExist)
                                            };
                                        }, _this3.props.onAfterEnter());
                                    };

                                    if (hasAnimate) {
                                        _context2.next = 6;
                                        break;
                                    }

                                    return _context2.abrupt('return', removeChildFromState());

                                case 6:
                                    updateProps = _this3.makeUpdateProps(child.key);


                                    updateProps(function (props) {
                                        return {
                                            className: new _immutable.Set([_this3.transitionNames.leave])
                                        };
                                    });

                                    setTimeout(function () {
                                        updateProps(function (_ref7) {
                                            var className = _ref7.className;
                                            return {
                                                className: className.add(_this3.transitionNames.leaveActive)
                                            };
                                        });

                                        setTimeout(function () {
                                            updateProps({ className: new _immutable.Set() });

                                            removeChildFromState();
                                        }, _this3.props.transitionLeaveTimeout);
                                    });

                                case 9:
                                case 'end':
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, _this3);
                }));

                return function (_x4) {
                    return _ref5.apply(this, arguments);
                };
            }());
        }
    }, {
        key: 'makeKeyNotExist',
        value: function makeKeyNotExist(children) {
            var keys = children.map(function (_ref8) {
                var key = _ref8.key;
                return key;
            });

            return function (child) {
                return !keys.includes(child.key);
            };
        }
    }, {
        key: 'mergeChildren',
        value: function mergeChildren() {
            var prevChildren = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            var nextChildren = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

            var isPrevKeyNotExist = this.makeKeyNotExist(prevChildren);
            var isNextKeyNotExist = this.makeKeyNotExist(nextChildren);

            this.enteringChildren = this.enteringChildren.concat(nextChildren.filter(isPrevKeyNotExist).map(function (child) {
                return {
                    key: child.key,
                    node: child,
                    props: { className: new _immutable.Set() }
                };
            }));

            this.leavingChildren = this.leavingChildren.concat(prevChildren.filter(isNextKeyNotExist));
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this.updateTransitionNames(nextProps.transitionNames);

            var existingChildren = this.state.children.concat(this.enteringChildren).concat(this.enteringChildrenIterim);

            this.mergeChildren(existingChildren, nextProps.children);
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            // Children lifecycles

            if (!this.hasAppeared) {
                this.initiateAppearingChildren(this.props.transitionAppear);
                this.hasAppeared = true;
            } else {
                this.initiateEnteringChildren(this.props.transitionEnter);
            }

            this.initiateLeavingChildren(this.props.transitionLeave);
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                null,
                this.state.children.map(this.childrenBuilder)
            );
        }
    }]);

    return Transition;
}(_react2.default.Component);

Transition.defaultProps = {
    transitionAppear: false,
    transitionEnter: true,
    transitionLeave: true,
    transitionAppearTimeout: 500,
    transitionEnterTimeout: 500,
    transitionLeaveTimeout: 500,
    onBeforeAppear: function onBeforeAppear() {
        return null;
    },
    onAfterAppear: function onAfterAppear() {
        return null;
    },
    onBeforeEnter: function onBeforeEnter() {
        return null;
    },
    onAfterEnter: function onAfterEnter() {
        return null;
    },
    onBeforeLeave: function onBeforeLeave() {
        return null;
    },
    onAfterLeave: function onAfterLeave() {
        return null;
    },
    transitionNames: {
        enter: 'enter',
        enterActive: 'enter-active',
        leave: 'leave',
        leaveActive: 'leave-active',
        appear: 'appear',
        appearActive: 'appear-active'
    }
};
Transition.propTypes = {
    transitionAppear: _propTypes2.default.bool,
    transitionEnter: _propTypes2.default.bool,
    transitionLeave: _propTypes2.default.bool,
    transitionAppearTimeout: _propTypes2.default.number,
    transitionEnterTimeout: _propTypes2.default.number,
    transitionLeaveTimeout: _propTypes2.default.number,
    onBeforeAppear: _propTypes2.default.func,
    onAfterAppear: _propTypes2.default.func,
    onBeforeEnter: _propTypes2.default.func,
    onAfterEnter: _propTypes2.default.func,
    onBeforeLeave: _propTypes2.default.func,
    onAfterLeave: _propTypes2.default.func,
    transitionNames: _propTypes2.default.object
};
exports.default = Transition;