import React, {Component} from "react";

class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
      return (<h1>Home page</h1>);
    }

    componentDidMount() {
        var self = this;
    }
    componentWillUnmount() {
    }
}


export default Home;
