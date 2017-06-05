import React, {Component} from "react";
import {
    Form,
    FormGroup,
    Label,
    UncontrolledTooltip,
    Tooltip,
    Col,
    Input,
    InputGroup,
    InputGroupAddon,
    FormFeedback,
    Button
} from "reactstrap";
import {CategorySelector} from "../components";

class DescriptionAnnouncement extends Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.validate = this.validate.bind(this);
        this.toggleTooltip = this.toggleTooltip.bind(this);
        this.state = {
            name: null,
            description: null,
            price: null,
            tooltip: {
                toggleName: false,
                toggleDescription: false,
                togglePrice: false
            },
            valid: {
                isNameInvalid: false,
                isDescriptionInvalid: false,
                isPriceInvalid: false
            }
        };
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

    validate() {
        var self = this,
            valid = self.state.valid,
            isValid = true;
        // Check name
        if (!self.state.name || self.state.name.length < 1 || self.state.name.length > 15) {
            valid.isNameInvalid = true;
            isValid = false;
        } else {
            valid.isNameInvalid = false;
        }

        // Check description
        if (!self.state.description || self.state.description.length < 1 || self.state.description.length > 255) {
            valid.isDescriptionInvalid = true;
            isValid = false;
        } else {
            valid.isDescriptionInvalid = false;
        }

        // Check priceTooltip
        if (self.state.price && self.state.price !== null && (isNaN(parseFloat(self.state.price)) || !isFinite(self.state.price) || parseFloat(self.state.price) < 0)) {
            valid.isPriceInvalid = true;
            isValid = false;
        } else {
            valid.isPriceInvalid = false;
        }

        this.setState({
            valid: valid
        });

        if (!isValid) {
            return;
        }

        var category = this.refs.categorySelector.getCategory();
        var json = {
            name: this.state.name,
            description: this.state.description,
            price: this.state.price
        };
        if (category && category !== null) {
            json.category_id = category.id;
        }

        this.props.onNext(json);
    }

    render() {
        var nameError = this.buildErrorTooltip('isNameInvalid', 'Should contains 1 to 15 characters'),
            descriptionError = this.buildErrorTooltip('isDescriptionInvalid', 'Should contains 1 to 255 characters'),
            priceError = this.buildErrorTooltip('isPriceInvalid', 'the price should be a number > 0');

        const txtToolTipName = 'Displayed name';
        const txtToolTipDescription = 'Description of your announce';
        const txtToolTipPrice = 'Your price estimation';

        const feedbackName = nameError ? 'warning' : undefined;
        const feedbackDescription = descriptionError ? 'warning' : undefined;
        const feedbackPrice = priceError ? 'warning' : undefined;

        return (
            <div className="container bg-white rounded">
                <section className="row p-1">
                    <div className="col-md-12">
                        <Form>
                            <FormGroup color={feedbackName}>
                                <Label sm={12}>Name <i className="fa fa-info-circle text-info"
                                                       id="toolTipName"/></Label>
                                <UncontrolledTooltip placement="right" target="toolTipName">
                                    {txtToolTipName}
                                </UncontrolledTooltip>
                                <Col sm={12}>
                                    <Input state={feedbackName}
                                           type="text"
                                           name="name"
                                           onChange={this.handleInputChange}/>
                                    <FormFeedback>{nameError}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup color={feedbackDescription}>
                                <Label sm={12}>Description <i
                                    className="fa fa-info-circle text-info"
                                    id="toolTipDescription"/></Label>
                                <UncontrolledTooltip placement="right" target="toolTipDescription">
                                    {txtToolTipDescription}
                                </UncontrolledTooltip>
                                <Col sm={12}>
                                    <Input state={feedbackDescription}
                                           type="textarea"
                                           name="description"
                                           onChange={this.handleInputChange}/>
                                    <FormFeedback>{descriptionError}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <CategorySelector ref="categorySelector"/>
                            <FormGroup color={feedbackPrice}>
                                <Label sm={12}>Price <i className="fa fa-info-circle text-info"
                                                        id="toolTipPrice"/></Label>
                                <UncontrolledTooltip placement="right" target="toolTipPrice">
                                    {txtToolTipPrice}
                                </UncontrolledTooltip>
                                <Col sm={12}>
                                    <InputGroup>
                                        <InputGroupAddon>€</InputGroupAddon>
                                        <Input state={feedbackPrice}
                                               type="number"
                                               name="price"
                                               onChange={this.handleInputChange}/>
                                        <FormFeedback>{priceError}</FormFeedback>
                                    </InputGroup>
                                </Col>
                            </FormGroup>
                        </Form>
                    </div>
                </section>
                <section className="row p-1">
                    <Button outline
                            color="info"
                            onClick={this.validate}>Next</Button>
                </section>
            </div>);
    }
}

export default DescriptionAnnouncement;
