import React, { Component } from "react";
import './styles/footer.css';

class Footer extends Component {
  render() {
    return (<footer className="footer">
      <div id="copyrights">
        <div className="container">
          <div className="row">
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6"><span className="font-primary">© Adv. ICT 2017. All Rights Reserved.</span></div>
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6"><a href="#">Forum</a></div>
          </div>
        </div>
      </div>
    </footer>);
  }
}

export default Footer;
