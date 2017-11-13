import React, {Component} from "react";
import { ShopsService } from "../services/index";
import { NavLink } from "react-router-dom";
import { translate } from 'react-i18next';
import { Button } from 'reactstrap';
import Constants from '../../Constants';
import Widget from "../components/widget";
import Rater from "react-rater";
import AppDispatcher from "../appDispatcher";
import $ from "jquery";

class TrendingSellers extends Component {
    constructor(props) {
        super(props);
        this._waitForToken = null;
        this.navigate = this.navigate.bind(this);
        this.localize = this.localize.bind(this);
        this.navigateToGame = this.navigateToGame.bind(this);
        this.state = {
            errorMessage: null,
            isLoading: false,
            shops: [],
            navigation: []
        };
    }

    localize(e, shop) {
        e.preventDefault();
        e.stopPropagation();
        this.props.setCurrentMarker(shop.id);
    }

    // Navigate through the pages
    navigate(e, name) {
        e.preventDefault();
        var startIndex = name - 1;
        var request = $.extend({}, this.request, {
            start_index: startIndex
        });
        this.display(request);
    }

    reset() {
      this.setState({
          shops: [],
          navigation: []
      });
    }

    // Refresh the view
    refresh(json) {
        var request = $.extend({}, json, {
            orders: [
                {target: "total_score", method: "desc"}
            ],
            count: 5
        });
        this.request = request;
        this.display(request);
    }

    // Display the list
    display(request) {
        var self = this;
        self.setState({
            isLoading: true
        });
        ShopsService.search(request).then(function (r) {
            var shops = r['_embedded'],
                navigation = r['_links']['navigation'];
            if (!(shops instanceof Array)) {
                shops = [shops];
            }

            if (!(navigation instanceof Array)) {
                navigation = [navigation];
            }

            self.setState({
                shops: shops,
                navigation: navigation,
                isLoading: false
            });
        }).catch(function () {
            self.setState({
                shops: [],
                navigation: [],
                isLoading: false
            });
        });
    }

    enableMove(b) {
      this.refs.widget.enableMove(b);
    }

    navigateToGame(e, shopId) { // Navigate to the game.
      e.preventDefault();
      e.stopPropagation();
      window.open(Constants.gameUrl + '?shop_id=' + shopId, "_blank");
    }

    // Render the view
    render() {
        const {t} = this.props;
        var content = [],
            navigations = [],
            self = this,
            title = t('trendingSellersWidgetTitle');
        if (this.state.isLoading) {
            return (
                <Widget title={title} onClose={this.props.onClose} ref="widget">
                    <i className='fa fa-spinner fa-spin'></i>
                </Widget>);
        }

        if (this.state.shops && this.state.shops.length > 0) {
            this.state.shops.forEach(function (shop) {
                var profileImage = shop.profile_image;
                if (!profileImage) {
                    profileImage = "/images/default-shop.png";
                }
                var tags = [];
                if (shop.tags && shop.tags.length > 0) {
                  shop.tags.forEach(function(tag) {
                    tags.push((<li>{tag}</li>));
                  });
                }

                content.push((
                    <NavLink to={'/shops/' + shop.id + '/view/profile'} className="list-group-item list-group-item-action no-padding">
                        <div className="first-column">
                            <img src={profileImage} className="img-thumbnail rounded picture image-small"/>
                        </div>
                        <div className="second-column">
                            <div>{shop.name}</div>
                            <div>
                                <Rater total={5} rating={shop.average_score} interactive={false}/><i>{t('comments')}
                                : {shop.nb_comments}</i>
                            </div>
                        </div>
                        <div className="last-column">
                            <Button outline color="secondary" size="sm">
                              <i className="fa fa-map-marker localize" onClick={(e) => {
                                  self.localize(e, shop);
                              }}></i>
                            </Button>
                            <a href="#" onClick={ (e) => self.navigateToGame(e, shop.id) } className="btn btn-outline-secondary btn-sm no-style">
                              <i className="fa fa-gamepad gamepad"></i>
                            </a>
                            <br />
                            <i>{shop.category.name}</i><br/>
                        </div>
                    </NavLink>));
            });
        }

        if (this.state.navigation && this.state.navigation.length > 1) {
            this.state.navigation.forEach(function (nav) {
                navigations.push((
                    <li key={nav.name} className="page-item"><a href="#" className="page-link" onClick={(e) => {
                        self.navigate(e, nav.name);
                    }}>{nav.name}</a></li>
                ));
            });
        }

        return (
            <Widget title={title} onClose={this.props.onClose} ref="widget">
                {navigations.length > 0 && (
                    <ul className="pagination">
                        {navigations}
                    </ul>
                )}
                {content.length == 0
                    ? (<span>No shops</span>) :
                    (<ul className="list-group list-group-flush">
                        {content}
                    </ul>)
                }
            </Widget>
        );
    }

    // Execute after the render
    componentDidMount() {
        var self = this;
        this._waitForToken = AppDispatcher.register(function (payload) {
            switch (payload.actionName) {
                case Constants.events.NEW_SHOP_ARRIVED:
                case Constants.events.NEW_SHOP_COMMENT_ARRIVED:
                case Constants.events.REMOVE_SHOP_COMMENT_ARRIVED:
                    var request = $.extend({}, self.request, {
                        start_index: 0
                    });
                    self.refresh(request);
                    break;
            }
        });
    }

    componentWillUnmount() {
      AppDispatcher.unregister(this._waitForToken);
    }
}

export default translate('common', { wait: process && !process.release, withRef: true })(TrendingSellers);
