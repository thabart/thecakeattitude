import React, {Component} from "react";
import { Form, FormGroup, Label, Col, Row, Input, Button, FormFeedback, UncontrolledTooltip, Modal, ModalHeader, ModalBody } from "reactstrap";
import { ShopsService, SessionService } from "../services/index";
import { CategorySelector, TagsSelector } from "../components";
import { translate } from 'react-i18next';
import { ApplicationStore } from '../stores/index';
import ShopChooser from "../game/shopChooser";
import "react-tagsinput/react-tagsinput.css";
import $ from "jquery";

class DescriptionForm extends Component {
    constructor(props) {
        super(props);
        this.uploadBannerImage = this.uploadBannerImage.bind(this);
        this.uploadPictureImage = this.uploadPictureImage.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.toggleTooltip = this.toggleTooltip.bind(this);
        this.validate = this.validate.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.state = {
            name: null,
            description: null,
            isCategoryLoading: false,
            isSubCategoryLoading: false,
            categories: [],
            subCategories: [],
            subCategoryIdSelected: null,
            bannerImage: null, // Images.
            pictureImage: null,
            isBannerImageModalOpened: false, // Modal windows.
            isProfilePictureModalOpened: false,
            tooltip: {
                toggleName: false,
                toggleDescription: false,
                toggleErrorName: false,
                toggleErrorDescription: false,
                toggleProfileImage: false,
                toggleBannerImage: false
            },
            valid: {
                isNameInvalid: false,
                isDescriptionInvalid: false
            }
        };
    }

    toggleModal(name) { // Toggle modal window.
      this.setState({
        [name] : !this.state[name]
      });
    }

    toggleTooltip(name) { // Toggle tooltips.
        var tooltip = this.state.tooltip;
        tooltip[name] = !tooltip[name];
        this.setState({
            tooltip: tooltip
        });
    }

    handleInputChange(e) { // Handle the input change (set property values).
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    uploadImage(e, callback) { // Common function used to upload the image.
        e.preventDefault();
        var file = e.target.files[0];
        if (file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/jpeg') {
          return;
        }

        var reader = new FileReader();
        reader.onloadend = () => {
            callback(reader.result);
        };
        reader.readAsDataURL(file);
    }

    uploadBannerImage(e) { // Upload banner image and display it.
        var self = this;
        self.uploadImage(e, function (result) {
            self.setState({
                bannerImage: result
            });
        });
    }

    uploadPictureImage(e) { // Upload the profile picture and display it.
        var self = this;
        self.uploadImage(e, function (result) {
            self.setState({
                pictureImage: result
            });
        });
    }

    validate() { // Execute the validation.
        var self = this,
            valid = self.state.valid,
            isValid = true,
            {t} = this.props;
        if (!self.state.name || self.state.name.length < 1 || self.state.name.length > 15) { // Check name.
            valid.isNameInvalid = true;
            isValid = false;
        } else {
            valid.isNameInvalid = false;
        }

        if (!self.state.description || self.state.description.length < 1 || self.state.description.length > 255) { // Check description.
            valid.isDescriptionInvalid = true;
            isValid = false;
        } else {
            valid.isDescriptionInvalid = false;
        }

        this.setState({
            valid: valid
        });

        if (!isValid) {
            return;
        }

        self.props.onLoading(true);
        var userInfo = ApplicationStore.getUser();

        ShopsService.search({ // Check that no shop has been added to the selected category.
          category_id: self.state.subCategoryIdSelected,
          subject: userInfo.sub
        }).then(function () {
          self.props.onLoading(false);
          self.props.onError(t('shopExistsInCategoryError'));
        }).catch(function (e) {
          var json = {
            name: self.state.name,
            description: self.state.description,
            tags: self.refs.shopTags.getTags(),
            banner_image: self.state.bannerImage,
            profile_image: self.state.pictureImage,
            category_id: self.state.subCategoryIdSelected,
            place: self.state.place
          };

          self.props.onLoading(false);
          self.props.onError(null);
          self.props.onNext(json);
        });
    }

    buildError(validName, description) { // Build an error.
        var result;
        if (this.state.valid[validName]) {
            result = (
                <span>
                    {description}
                </span>);
        }

        return result;
    }

    render() { // Return the view.
        const {t} = this.props;
        const txtToolTipName = t('shopNameAddFormTooltip');;
        const txtToolTipDescription = t('shopDescriptionAddFormTooltip');
        const txtToolTipTags = t('shopTagsAddFormTooltip');
        const txtToolTipBanner = t('shopBannerAddFormTooltip');
        const txtToolTipPicture = t('shopProfilePictureAddFormTooltip');
        const bannerImagePreview = this.state.bannerImage && (
                <div><a href="#" onClick={(e) => { e.preventDefault(); this.toggleModal('isBannerImageModalOpened')}}><img className='img-thumbnail' src={this.state.bannerImage} width='50' height='50'/></a></div>);
        const pictureImagePreview = this.state.pictureImage && (
                <div><a href="#" onClick={(e) => { e.preventDefault(); this.toggleModal('isProfilePictureModalOpened'); }}><img className='img-thumbnail' src={this.state.pictureImage} width='100' height='100'/></a></div>);
        const nameError = this.buildError('isNameInvalid', t('contains1To15CharsError'));
        const descriptionError = this.buildError('isDescriptionInvalid', t('contains1To255CharsError'));
        const feedbackName = nameError ? "danger" : undefined;
        const feedbackDescription = descriptionError ? "danger" : undefined;
        let categories = [];
        let subCategories = [];
        const self = this;

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
            <div className="container rounded">
                <section className="row p-1">
                    <div className="col-md-12">
                        <Form>
                            <FormGroup color={feedbackName}> { /* Name */ }
                                <Label sm={12}>{t('name')} <i className="fa fa-info-circle txt-info"
                                                       id="toolTipName"/></Label>
                                <UncontrolledTooltip placement="right" target="toolTipName" className="red-tooltip-inner">
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
                            <CategorySelector onSubCategory={(id) => {
                              self.setState({
                                subCategoryIdSelected: id
                              });
                            }}/> { /* Shop category */ }
                            <FormGroup> { /* Tags */ }
                                <Label sm={12}>{t('tags')} <i className="fa fa-info-circle txt-info"
                                                       id="toolTipTags"/></Label>
                                <UncontrolledTooltip placement="right" target="toolTipTags" className="red-tooltip-inner">
                                    {txtToolTipTags}
                                </UncontrolledTooltip>
                                <Col sm={12}>
                                    <TagsSelector ref="shopTags"/>
                                </Col>
                            </FormGroup>
                            <FormGroup color={feedbackDescription}> { /* Description */ }
                                <Label sm={12}>{t('description')} <i
                                    className="fa fa-info-circle txt-info"
                                    id="toolTipDescription"/></Label>
                                <UncontrolledTooltip placement="right" target="toolTipDescription" className="red-tooltip-inner">
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
                            <FormGroup> { /* Banner image */ }
                                <Label sm={12}>{t('bannerImage')} <i className="fa fa-info-circle txt-info"
                                                               id="toolTipBanner"/></Label>
                                <UncontrolledTooltip placement="right" target="toolTipBanner" className="red-tooltip-inner">
                                    {txtToolTipBanner}
                                </UncontrolledTooltip>
                                <Row>
                                    <Col sm={8}>
                                        <Input type="file"
                                               accept=".png, .jpg, .jpeg"
                                               onChange={(e) => this.uploadBannerImage(e)}/>
                                    </Col>
                                    <Col sm={4}>
                                        <FormFeedback>{bannerImagePreview}</FormFeedback>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup> { /* Profile picture */ }
                                <Label sm={12}>{t('profilePicture')} <i
                                    className="fa fa-info-circle txt-info"
                                    id="toolTipPicture"/></Label>
                                <UncontrolledTooltip placement="right" target="toolTipPicture" className="red-tooltip-inner">
                                    {txtToolTipPicture}
                                </UncontrolledTooltip>
                                <Row>
                                    <Col sm={8}>
                                        <Input type="file"
                                               accept=".png, .jpg, .jpeg"
                                               onChange={(e) => this.uploadPictureImage(e)}/>
                                    </Col>
                                    <Col sm={4}>
                                        <FormFeedback>{pictureImagePreview}</FormFeedback>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Form>
                    </div>
                </section>
                <section className="row p-1">
                    <Button color="default" onClick={this.validate}>{t('next')}</Button>
                </section>
                {/* Modal : banner image */ }
                <Modal isOpen={this.state.isBannerImageModalOpened} size="lg">
                  <ModalHeader toggle={() => this.toggleModal('isBannerImageModalOpened')} className="redColor">
                    <h2>{t('bannerImageModalTitle')}</h2>
                  </ModalHeader>
                  <ModalBody style={{overflow: "hidden", textAlign: "center"}}>
                    <img src={self.state.bannerImage} style={{maxWidth:"400px"}}/>
                  </ModalBody>
                </Modal>
                {/* Modal : profile picture */}
                <Modal isOpen={this.state.isProfilePictureModalOpened} size="lg">
                  <ModalHeader toggle={() => this.toggleModal('isProfilePictureModalOpened')} className="redColor">
                    <h2>{t('profilePictureModalTitle')}</h2>
                  </ModalHeader>
                  <ModalBody style={{overflow: "hidden", textAlign: "center"}}>
                    <img src={self.state.pictureImage} style={{maxWidth:"400px"}} />
                  </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default translate('common', { wait: process && !process.release })(DescriptionForm);
