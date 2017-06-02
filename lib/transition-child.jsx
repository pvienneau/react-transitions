import React from 'react';

import autobind from 'react-autobind';

export default class TransitionChild extends React.Component {
    constructor(props) {
        super(props);

        autobind(this);
    }

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}
