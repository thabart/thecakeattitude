import React, {Component} from "react";
import { translate } from 'react-i18next';

class PackagingType extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      weight: 0,
      length: 0,
      width: 0,
      height: 0
    };
  }

  handleInputChange(e) { // Handle the input change.
      const target = e.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      this.setState({
          [name]: value
      });
  }

  render() { // Display the component.
    const {t} = this.props;
    var self = this;
    return (<div>
      <div className="row" style={{padding: "10px"}}>
        <div className="col-md-6">
          <div className="form-group">
            <label>Weight (kgs)</label>
            <input type="number" className="form-control" min="0" name='weight' value={this.state.weight} onChange={self.handleInputChange} />
          </div>
          <div className="form-group">
            <label>Length (cm)</label>
            <input type="number" className="form-control" min="0" name='length' value={this.state.length} onChange={self.handleInputChange} />
          </div>
          <div className="form-group">
            <label>Width (cm)</label>
            <input type="number" className="form-control" min="0" name='width' value={this.state.width} onChange={self.handleInputChange} />
          </div>
          <div className="form-group">
            <label>Height (cm)</label>
            <input type="number" className="form-control" min="0" name='height'value={this.state.height} onChange={self.handleInputChange} />
          </div>
        </div>
        <div className="col-md-6" style={{textAlign: "center"}}>
          <div style={{position: "relative", display: "inline-block", width: "280px", height: "200px"}}>
            <img src="/images/shipping-box.svg" width="170" height="171" />
            <span style={{position: "absolute", top: "0px", right: "20px"}}>{this.state.length} cm</span>
            <span style={{position: "absolute", top: "70px", right: "0px"}}>{this.state.height} cm</span>
            <span style={{position: "absolute", bottom: "0px", left: "120px"}}>{this.state.width} cm</span>
          </div>
        </div>
      </div>
      <div>
        <button className="btn btn-default">Update price</button>
        <button className="btn btn-default" style={{marginLeft: "5px"}}>{t('next')}</button>
      </div>
    </div>)
  }
}

export default translate('common', { wait: process && !process.release })(PackagingType);
