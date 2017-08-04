import React, {Component} from "react";
import CategorySelector from './categorySelector';
import '../styles/editable.css';

class EditableCategory extends Component {
  constructor(props) {
    super(props);
    this.onClickField = this.onClickField.bind(this);
    this.validate = this.validate.bind(this);
    this.closeEditMode = this.closeEditMode.bind(this);
    this.state = {
      isEditMode: false,
      value: props.value
    };
  }
  onClickField() {
    this.setState({
      isEditMode: true
    });
  }
  validate() {
    var category = this.refs.categorySelector.getCategory();
    this.setState({
      value: category.name,
      isEditMode: false
    });
  }
  closeEditMode() {
    this.setState({
      isEditMode: false
    });
  }
  render() {
    var self = this,
      categories = [],
      subCategories = [];
    if (!this.state.isEditMode) {
      return (<div onClick={(e) => { this.onClickField(); }} className="editable-input">
        <span className={this.props.className}>{this.state.value}</span>
      </div>);
    }

    var self = this;
        categories = [],
        subCategories = [];
    if (this.state.categories) {
      this.state.categories.forEach(function (category) {
        categories.push(<option value={category.id}>{category.name}</option>);
      });
    }

    if (this.state.subCategories) {
      this.state.subCategories.forEach(function (category) {
        subCategories.push(<option value={category.id}>{category.name}</option>);
      });
    }

    return (
      <div className="row col-md-12">
        <div className="col-md-8">
          <CategorySelector ref="categorySelector" />
        </div>
        <div className="col-md-4">
          <button className="btn btn-primary btn-sm" onClick={(e) => {this.validate(); }}><i className="fa fa-check"></i></button>
          <button className="btn btn-default btn-sm" onClick={(e) => {this.closeEditMode(); }}><i className="fa fa-times"></i></button>
        </div>
      </div>
    );
  }
}

export default EditableCategory;
