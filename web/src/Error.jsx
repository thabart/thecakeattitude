import React, {Component} from "react";
import "./error.css";

class Error extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var type = this.props.match.params.type;
        var result = (<h3>Something goes wrong</h3>);
        switch (type) {
            case "404":
                result = (<h3>The resource cannot be found</h3>);
                break;
        }

        return ( <div className='error-container container'>{result}</div>);
    }
}

export default Error;
