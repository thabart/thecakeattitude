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
import { translate } from 'react-i18next';
import { CategorySelector } from "../components";

class DescriptionClientService extends Component {
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

    handleInputChange(e) { // Handle the input change.
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    toggleTooltip(name) { // Toggle tooltip.
        var tooltip = this.state.tooltip;
        tooltip[name] = !tooltip[name];
        this.setState({
            tooltip: tooltip
        });
    }

    buildErrorTooltip(validName, description) { // Build error tooltip.
        var result;
        if (this.state.valid[validName]) {
            result = (
                <span>
                {description}
              </span> );
        }

        return result;
    }

    validate() { // Validate the form.
        var self = this,
            valid = self.state.valid,
            isValid = true;
        // Check name
        if (!self.state.name || self.state.name.length < 1 || self.state.name.length > 50) {
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

        var category = this.refs.categorySelector.getWrappedInstance().getCategory();
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

    render() { // Display the component.
        const {t} = this.props;
        var nameError = this.buildErrorTooltip('isNameInvalid', t('contains1To15CharsError')),
            descriptionError = this.buildErrorTooltip('isDescriptionInvalid', t('contains1To255CharsError')),
            priceError = this.buildErrorTooltip('isPriceInvalid', t('priceInvalid'));

        const txtToolTipName = t('nameClientServiceTooltip');
        const txtToolTipDescription = t('descriptionClientServiceTooltip');
        const txtToolTipPrice = t('priceClientServiceTooltip');

        const feedbackName = nameError ? 'danger' : undefined;
        const feedbackDescription = descriptionError ? 'danger' : undefined;
        const feedbackPrice = priceError ? 'danger' : undefined;

        return (
            <div className="container bg-white rounded">
                <section className="row p-1">
                    <div className="col-md-12">
                        <p dangerouslySetInnerHTML={{__html: t('clientServiceDescription')}}></p>
                        <Form>
                            <FormGroup color={feedbackName}>
                                <Label sm={12}>{t('name')} <i className="fa fa-info-circle txt-info" id="toolTipName"/></Label>
                                <UncontrolledTooltip placement="right" target="toolTipName" className="red-tooltip-inner">
                                    {txtToolTipName}
                                </UncontrolledTooltip>
                                <Col sm={12}>
                                    <Input state={feedbackName} type="text" name="name" onChange={this.handleInputChange}/>
                                    <FormFeedback>{nameError}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup color={feedbackDescription}>
                                <Label sm={12}>{t('description')} <i className="fa fa-info-circle txt-info" id="toolTipDescription"/></Label>
                                <UncontrolledTooltip placement="right" target="toolTipDescription" className="red-tooltip-inner">
                                    {txtToolTipDescription}
                                </UncontrolledTooltip>
                                <Col sm={12}>
                                    <Input state={feedbackDescription} type="textarea" name="description" onChange={this.handleInputChange}/>
                                    <FormFeedback>{descriptionError}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <CategorySelector ref="categorySelector"/>
                            <FormGroup color={feedbackPrice}>
                                <Label sm={12}>{t('price')} <i className="fa fa-info-circle txt-info" id="toolTipPrice"/></Label>
                                <UncontrolledTooltip placement="right" target="toolTipPrice" className="red-tooltip-inner">
                                    {txtToolTipPrice}
                                </UncontrolledTooltip>
                                <Col sm={12}>
                                    <InputGroup>
                                        <InputGroupAddon>€</InputGroupAddon>
                                        <Input state={feedbackPrice} type="number" name="price" onChange={this.handleInputChange}/>
                                        <FormFeedback>{priceError}</FormFeedback>
                                    </InputGroup>
                                </Col>
                            </FormGroup>
                        </Form>
                    </div>
                </section>
                <section className="row p-1">
                    <Button color="default" onClick={this.validate}>{t('next')}</Button>
                </section>
            </div>);
    }
}

export default translate('common', { wait: process && !process.release })(DescriptionClientService);
