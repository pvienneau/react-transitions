import React from 'react';

import autoBind from 'react-autobind';

class Component extends React.Component {
    constructor(props) {
        super(props);

        autoBind(this);
    }

    toggleState(name, callback) {
        this.setState({ [name]: !this.state[name] }, callback);
    }

    render() {
        return null;
    }
}

export default Component;
