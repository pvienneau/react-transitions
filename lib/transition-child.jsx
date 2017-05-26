import React from 'react';

import Component from 'utils/component';

export default class TransitionChild extends Component {
    // state = {
    //     render: false,
    // }

    // componentDidMount() {
    //     Promise.all([this.props.onBeforeEnter()]).then(() => {
    //         this.setState({render: true}, () => console.log('enter'));
    //         this.props.onAfterEnter();
    //     });
    // }

    // componentWillUnmount() {
    //     Promise.all([this.props.onBeforeLeave()]).then(() => {
    //         console.log('leave');
    //         this.props.onAfterLeave();
    //     });
    // }

    render() {
        //if (!this.state.render) return false;

        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}
