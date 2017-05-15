import React, {Component} from "react";
import {TabContent, TabPane, Alert} from "reactstrap";

class DescriptionAnnouncement extends Component {
  constructor(props) {
    super(props);
    this.validate = this.validate.bind(this);
  }
  validate() {
    this.props.onNext();
  }
  render() {
    return (
    <div>
      <section className="row">
        <div className="form-group col-md-12">
          <label className='control-label'>Name</label> <i className="fa fa-exclamation-circle"></i>
          <input type='text' className='form-control' name='name'/>
        </div>
        <div className="form-group col-md-12">
          <label className='control-label'>Description</label> <i className="fa fa-exclamation-circle"></i>
          <textarea className='form-control' name='name'></textarea>
        </div>
        <div className="form-group col-md-12 row">
          <div className="col-md-6">
            <div className="form-group">
              <label className="control-label">Categories</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="control-label">Sub categories</label>
            </div>
          </div>
        </div>
        <div className="form-group col-md-12">
          <label className="control-label">Price</label> <i className="fa fa-exclamation-circle"></i>
          <input type="number" className="form-control" />
        </div>
      </section>
      <section className="col-md-12 sub-section">
          <button className="btn btn-primary next" onClick={this.validate}>Next</button>
      </section>
    </div>);
  }
}

export default DescriptionAnnouncement;
