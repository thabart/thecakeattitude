import React, {Component} from "react";
import {Form, FormGroup, Label, Col, Row, Input, Button, FormFeedback, UncontrolledTooltip, Modal, ModalHeader, ModalBody} from "reactstrap";
import {CategoryService, ShopsService, OpenIdService, SessionService} from "../services/index";
import {CategorySelector, TagsSelector} from "../components";
import Game from "../game/game";
import "react-tagsinput/react-tagsinput.css";
import $ from "jquery";
import { translate } from 'react-i18next';

class DescriptionForm extends Component {
    constructor(props) {
        super(props);
        this.uploadBannerImage = this.uploadBannerImage.bind(this);
        this.uploadPictureImage = this.uploadPictureImage.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.toggleTooltip = this.toggleTooltip.bind(this);
        this.validate = this.validate.bind(this);
        this.selectMap = this.selectMap.bind(this);
        this.onHouseSelected = this.onHouseSelected.bind(this);
        this.changeMap = this.changeMap.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.state = {
            name: null,
            description: null,
            place: null,
            isCategoryLoading: false,
            isSubCategoryLoading: false,
            categories: [],
            subCategories: [],
            maps: [],
            subCategoryIdSelected: null,
            mapNameSelected: null,
            bannerImage: null, // Images.
            pictureImage: null,
            isBannerImageModalOpened: false, // Modal windows.
            isProfilePictureModalOpened: false,
            tooltip: {
                toggleName: false,
                toggleDescription: false,
                toggleChoosePlace: false,
                toggleErrorName: false,
                toggleErrorDescription: false,
                toggleErrorPlace: false,
                toggleProfileImage: false,
                toggleBannerImage: false
            },
            valid: {
                isNameInvalid: false,
                isDescriptionInvalid: false,
                isPlaceInvalid: false
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

        // Check at least one place is selected.
        if (!self.state.place || self.state.place === null) {
            valid.isPlaceInvalid = true;
            isValid = false;
        } else {
            valid.isPlaceInvalid = false;
        }

        this.setState({
            valid: valid
        });

        if (!isValid) {
            return;
        }

        // Check that no shop has been added to the selected category.
        self.props.onLoading(true);
        OpenIdService.getUserInfo(SessionService.getSession().access_token).then(function (userInfo) {
            ShopsService.search({
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
                    map_name: self.state.mapNameSelected,
                    category_id: self.state.subCategoryIdSelected,
                    place: self.state.place
                };

                self.props.onLoading(false);
                self.props.onNext(json);
            });
        }).catch(function () {
            self.props.onLoading(false);
            self.props.onError(t('errorOccuredMsg'));
        });
    }

    selectMap(e) { // When the selected map change, display the overview.
        var target = $(e.target).find(':selected');
        var map = {
            map_link: $(target).data('maplink'),
            overview_name: $(target).data('overviewname'),
            overview_link: $(target).data('overviewlink'),
            map_name: $(target).data('mapname')
        };
        this.displayMap(map);
    }

    displayMap(map) { // Display the overview.
        map['category_id'] = this.state.subCategoryIdSelected;
        this.refs.game.loadMap(map);
        this.state.place = null;
        this.setState({
            place: this.state.place,
            mapNameSelected: map.map_name
        });
    }

    changeMap(mapName) { // Change selected map name.
        this.state.mapNameSelected = mapName;
    }

    displayMaps(categoryId) { // Display all the maps for the given category.
        var self = this;
        CategoryService.get(categoryId).then(function (r) {
            var maps = r['_embedded']['maps'];
            self.setState({
                maps: maps,
                subCategoryIdSelected: categoryId
            });

            if (!maps) {
                return;
            }

            self.displayMap(maps[0]);
        });
    }

    onHouseSelected(place) { // Set the selected place.
        this.setState({
            place: place
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
        const txtToolTipGame = t('shopPlaceAddFormTooltip');
        const bannerImagePreview = this.state.bannerImage && (
                <div><a href="#" onClick={(e) => { e.preventDefault(); this.toggleModal('isBannerImageModalOpened')}}><img className='img-thumbnail' src={this.state.bannerImage} width='50' height='50'/></a></div>);
        const pictureImagePreview = this.state.pictureImage && (
                <div><a href="#" onClick={(e) => { e.preventDefault(); this.toggleModal('isProfilePictureModalOpened'); }}><img className='img-thumbnail' src={this.state.pictureImage} width='100' height='100'/></a></div>);
        const nameError = this.buildError('isNameInvalid', t('contains1To15CharsError'));
        const descriptionError = this.buildError('isDescriptionInvalid', t('contains1To255CharsError'));
        const placeError = this.buildError('isPlaceInvalid', t('placeShouldBeSelected'));
        const feedbackName = nameError ? "danger" : undefined;
        const feedbackDescription = descriptionError ? "danger" : undefined;
        const feedbackPlace = placeError ? "danger" : undefined;
        let categories = [];
        let subCategories = [];
        let maps = [];
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

        if (this.state.maps) {
            this.state.maps.forEach(function (map) {
                maps.push(<option data-maplink={map.map_link} data-overviewname={map.overview_name}
                                  data-overviewlink={map.overview_link}
                                  data-mapname={map.map_name}>{map.map_name}</option>);
            });
        }

        return (
            <div className="container rounded">
                <section className="row p-1">
                    <div className="col-md-6">
                        <Form>
                            <FormGroup color={feedbackName}>
                                <Label sm={12}>{t('name')} <i className="fa fa-info-circle txt-info"
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
                            <CategorySelector onSubCategory={(e) => {
                                if (e === null) {
                                    self.setState({
                                        maps: [],
                                        subCategoryIdSelected: null,
                                        place: null,
                                        mapNameSelected: null
                                    });
                                    self.refs.game.reset();
                                    return;
                                }

                                self.displayMaps(e);
                            }}/>
                            <FormGroup>
                                <Label sm={12}>{t('tags')} <i className="fa fa-info-circle txt-info"
                                                       id="toolTipTags"/></Label>
                                <UncontrolledTooltip placement="right" target="toolTipTags">
                                    {txtToolTipTags}
                                </UncontrolledTooltip>
                                <Col sm={12}>
                                    <TagsSelector ref="shopTags"/>
                                </Col>
                            </FormGroup>
                            <FormGroup color={feedbackDescription}>
                                <Label sm={12}>{t('description')} <i
                                    className="fa fa-info-circle txt-info"
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
                            <FormGroup>
                                <Label sm={12}>{t('bannerImage')} <i className="fa fa-info-circle txt-info"
                                                               id="toolTipBanner"/></Label>
                                <UncontrolledTooltip placement="right" target="toolTipBanner">
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
                            <FormGroup>
                                <Label sm={12}>{t('profilePicture')} <i
                                    className="fa fa-info-circle txt-info"
                                    id="toolTipPicture"/></Label>
                                <UncontrolledTooltip placement="right" target="toolTipPicture">
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
                    <div className="col-md-6">
                        <Form>
                            <FormGroup color={feedbackPlace}>
                                <Label sm={12}>{t('choosePlace')} <i
                                    className="fa fa-info-circle txt-info"
                                    id="toolTipGame"/></Label>
                                <UncontrolledTooltip placement="right" target="toolTipGame">
                                    {txtToolTipGame}
                                </UncontrolledTooltip>
                                <Col sm={12}>
                                    <Input state={feedbackPlace}
                                           type="select"
                                           onChange={this.selectMap}>
                                        {maps}
                                    </Input>
                                    <FormFeedback>{placeError}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <Game
                                ref="game"
                                onHouseSelected={this.onHouseSelected}
                                onLoadMap={(mapName) => {
                                    this.changeMap(mapName);
                                }}/>
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
                    <img src={self.state.bannerImage} />
                  </ModalBody>
                </Modal>
                {/* Modal : profile picture */}
                <Modal isOpen={this.state.isProfilePictureModalOpened} size="lg">
                  <ModalHeader toggle={() => this.toggleModal('isProfilePictureModalOpened')} className="redColor">
                    <h2>{t('profilePictureModalTitle')}</h2>
                  </ModalHeader>
                  <ModalBody style={{overflow: "hidden", textAlign: "center"}}>
                    <img src={self.state.pictureImage} />
                  </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default translate('common', { wait: process && !process.release })(DescriptionForm);
