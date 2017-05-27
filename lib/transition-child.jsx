import React from 'react';

import Component from 'utils/component';

export default class TransitionChild extends Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}
