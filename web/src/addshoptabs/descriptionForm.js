import React, {Component} from "react";
import {Form, FormGroup, Label, Col, Row, Input, Button, FormFeedback, UncontrolledTooltip} from "reactstrap";
import {CategoryService, ShopsService, OpenIdService, SessionService} from "../services/index";
import {CategorySelector, TagsSelector} from "../components";
import Game from "../game/game";
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
        this.selectMap = this.selectMap.bind(this);
        this.onHouseSelected = this.onHouseSelected.bind(this);
        this.changeMap = this.changeMap.bind(this);
        this.state = {
            name: null,
            description: null,
            place: null,
            bannerImage: null,
            pictureImage: null,
            isCategoryLoading: false,
            isSubCategoryLoading: false,
            categories: [],
            subCategories: [],
            maps: [],
            subCategoryIdSelected: null,
            mapNameSelected: null,
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

    toggleTooltip(name) {
        var tooltip = this.state.tooltip;
        tooltip[name] = !tooltip[name];
        this.setState({
            tooltip: tooltip
        });
    }

    handleInputChange(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    uploadImage(e, callback) {
        e.preventDefault();
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onloadend = () => {
            callback(reader.result);
        };
        reader.readAsDataURL(file);
    }

    uploadBannerImage(e) {
        var self = this;
        self.uploadImage(e, function (result) {
            self.setState({
                bannerImage: result
            });
        });
    }

    uploadPictureImage(e) {
        var self = this;
        self.uploadImage(e, function (result) {
            self.setState({
                pictureImage: result
            });
        });
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
                self.props.onError('you already have a shop on this category');
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
            self.props.onError('the subject cannot be retrieved');
        });
    }

    selectMap(e) {
        var target = $(e.target).find(':selected');
        var map = {
            map_link: $(target).data('maplink'),
            overview_name: $(target).data('overviewname'),
            overview_link: $(target).data('overviewlink'),
            map_name: $(target).data('mapname')
        };
        this.displayMap(map);
    }

    displayMap(map) {
        map['category_id'] = this.state.subCategoryIdSelected;
        this.refs.game.loadMap(map);
        this.state.place = null;
        this.setState({
            place: this.state.place,
            mapNameSelected: map.map_name
        });
    }

    changeMap(mapName) {
        this.state.mapNameSelected = mapName;
    }

    displayMaps(categoryId) {
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

    onHouseSelected(place) {
        this.setState({
            place: place
        });
    }

    buildError(validName, description) {
        var result;
        if (this.state.valid[validName]) {
            result = (
                <span>
                    {description}
                </span>);
        }

        return result;
    }

    render() {

        const txtToolTipName = 'Name displayed in the shop s profile';
        const txtToolTipDescription = 'Description displayed in the shop s profile';
        const txtToolTipTags = 'Add some tags to enrich the description of your shop';
        const txtToolTipBanner = 'Banner image displayed on your profile';
        const txtToolTipPicture = 'Profile s picture';
        const txtToolTipGame = 'Placement in the game';
        const bannerImagePreview = this.state.bannerImage && (
                <div><img className='img-thumbnail' src={this.state.bannerImage} width='50' height='50'/></div>);
        const pictureImagePreview = this.state.pictureImage && (
                <div><img className='img-thumbnail' src={this.state.pictureImage} width='100' height='100'/></div>);
        const nameError = this.buildError('isNameInvalid', 'Should contains 1 to 15 characters');
        const descriptionError = this.buildError('isDescriptionInvalid', 'Should contains 1 to 255 characters');
        const placeError = this.buildError('isPlaceInvalid', 'A place should be selected');
        const feedbackName = nameError ? "warning" : undefined;
        const feedbackDescription = descriptionError ? "warning" : undefined;
        const feedbackPlace = placeError ? "warning" : undefined;
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
            <div className="container bg-white rounded">
                <section className="row p-1">
                    <div className="col-md-6">
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
                                <Label sm={12}>Tags <i className="fa fa-info-circle text-info"
                                                       id="toolTipTags"/></Label>
                                <UncontrolledTooltip placement="right" target="toolTipTags">
                                    {txtToolTipTags}
                                </UncontrolledTooltip>
                                <Col sm={12}>
                                    <TagsSelector ref="shopTags"/>
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
                            <FormGroup>
                                <Label sm={12}>Banner image <i className="fa fa-info-circle text-info"
                                                               id="toolTipBanner"/></Label>
                                <UncontrolledTooltip placement="right" target="toolTipBanner">
                                    {txtToolTipBanner}
                                </UncontrolledTooltip>
                                <Row>
                                    <Col sm={8}>
                                        <Input type="file"
                                               accept="image/*"
                                               onChange={(e) => this.uploadBannerImage(e)}/>
                                    </Col>
                                    <Col sm={4}>
                                        <FormFeedback>{bannerImagePreview}</FormFeedback>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Label sm={12}>Profile picture <i
                                    className="fa fa-info-circle text-info"
                                    id="toolTipPicture"/></Label>
                                <UncontrolledTooltip placement="right" target="toolTipPicture">
                                    {txtToolTipPicture}
                                </UncontrolledTooltip>
                                <Row>
                                    <Col sm={8}>
                                        <Input type="file"
                                               accept="image/*"
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
                                <Label sm={12}>Choose a place <i
                                    className="fa fa-info-circle text-info"
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
                    <Button outline color="info" onClick={this.validate}>Next</Button>
                </section>
            </div>
        );
    }
}

export default DescriptionForm;
