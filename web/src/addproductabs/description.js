import React, {Component} from "react";
import {Tooltip} from 'reactstrap';
import './description.css';

class DescriptionTab extends Component {
  constructor(props) {
    super(props);
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.next = this.next.bind(this);
    this.uploadProductImage = this.uploadProductImage.bind(this);
    this.state = {
      name: null,
      description: null,
      images: [],
      tooltip: {
        toggleName: false
      },
      valid: {
        isNameInvalid: false
      }
    };
  }
  buildErrorTooltip(validName, description) {
      var result;
      if (this.state.valid[validName]) {
          result = (
            <span>
              <i className="fa fa-exclamation-triangle validation-error" id={validName}></i>
              <Tooltip placement="right" target={validName} isOpen={this.state.tooltip[validName]} toggle={() => {
                  this.toggleTooltip(validName);
              }}>
                {description}
              </Tooltip>
            </span> );
      }

      return result;
  }
  handleInputChange(e) {
      const target = e.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      this.setState({
          [name]: value
      });
  }
  toggleTooltip(name) {
      var tooltip = this.state.tooltip;
      tooltip[name] = !tooltip[name];
      this.setState({
          tooltip: tooltip
      });
  }
  next() {
    this.props.next();
  }
  uploadProductImage(e) {
    e.preventDefault();
    var self = this;
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onloadend = () => {
      var images = self.state.images;
      images.push(reader.result);
      self.setState({
        images: images
      });
    };
    reader.readAsDataURL(file);
  }
  render() {
    var nameError = this.buildErrorTooltip('isNameInvalid', 'Should contains 1 to 15 characters');
    var images = [];
    if (this.state.images && this.state.images.length > 0) {
      this.state.images.forEach(function(image) {
        images.push((<div className="col-md-2 product-image-container">
            <div className="close"><i className="fa fa-times"></i></div>
            <img src={image} width="50" height="50" />
        </div>));
      });
    }

    return (<div>
        <section className="row section">
          <div className="col-md-6 row">
            <div className="form-group col-md-12">
              <label className='control-label'>Name</label> <i className="fa fa-exclamation-circle" id="nameTooltip"></i>
              <Tooltip placement="right" target="nameTooltip" isOpen={this.state.tooltip.toggleName} toggle={() => { this.toggleTooltip('toggleName'); }}>
                Displayed name
              </Tooltip>
               {nameError}
              <input type='text' className='form-control' name='name' onChange={this.handleInputChange}/>
            </div>
            <div className="form-group col-md-12">
              <label className="control-label">Description</label>
              <textarea className='form-control' name='description' onChange={this.handleInputChange}></textarea>
            </div>
            <div className="form-group col-md-12">
              <label>Images</label>
              <div><input type='file' accept='image/*' onChange={(e) => this.uploadProductImage(e)}/></div>
              <div className="row">
                {images}
              </div>
            </div>
          </div>
          <div className="col-md-6 row">
            <div className="form-group col-md-12">
              <label className="control-label">Price</label>
              <div className="input-group">
                <span className="input-group-addon">€</span>
                <input className="form-control" type="number" />
              </div>
            </div>
            <div className="form-group col-md-12">
              <label className="control-label">Unit of measure</label>
              <select className="form-control">
                <option>Piece</option>
                <option>KG</option>
                <option>L</option>
              </select>
            </div>
            <div className="form-group col-md-12">
              <label className="control-label">Nb units</label>
              <input className="form-control" type="number" />
            </div>
            <div className="form-group col-md-12">
              <label className="control-label">Available in your stocks</label>
              <input className="form-control" type="number" />
            </div>
          </div>
      </section>
      <section className="col-md-12 sub-section">
          <button className="btn btn-primary next" onClick={this.next}>Next</button>
      </section>
    </div>);
  }
}

export default DescriptionTab;
