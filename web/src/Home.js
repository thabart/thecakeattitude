import React, {Component} from "react";
import { translate } from 'react-i18next';
import { StatsService, FeedService } from './services/index';
import MainLayout from './MainLayout';
import Constants from '../Constants';
import Slider from "react-slick";
import moment from 'moment';
import $ from 'jquery';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./styles/home.css";

const defaultCount = 5;

class Home extends Component {
    constructor(props) {
      super(props);
      this._page = '1';
      this._request = {
        count: defaultCount
      };
      this.navigate = this.navigate.bind(this);
      this.handleChangeUserType = this.handleChangeUserType.bind(this);
      this.toggleTab = this.toggleTab.bind(this);
      this.refreshFigures = this.refreshFigures.bind(this);
      this.refreshNews = this.refreshNews.bind(this);
      this.state = {
        isFiguresLoading: false,
        isNewsLoading: false,
        isSellerExplanationVisible : true,
        activeTab : '1',
        nbProducts: 0,
        nbServices: 0,
        nbShops: 0,
        news: [],
        navigation: []
      };
    }

    navigate(e, name) {   // Navigate through the pages
        e.preventDefault();
        this._page = name;
        var startIndex = name - 1;
        this._request = $.extend({}, this._request, {
            start_index: startIndex
        });
        this.refreshNews();
    }

    handleChangeUserType() {
      this.setState({
        isSellerExplanationVisible: !this.state.isSellerExplanationVisible
      });
    }

    toggleTab(e, activeTab) {
      e.preventDefault();
      this.setState({
        activeTab: activeTab
      });
    }

    refreshFigures() { // Refresh all the figures.
      var self = this;
      self.setState({
        isFiguresLoading: true
      });
      StatsService.get().then(function(resp) {
        self.setState({
          isFiguresLoading: false,
          nbProducts: resp.nb_products,
          nbServices: resp.nb_services,
          nbShops: resp.nb_shops
        });
      }).catch(function() {
        self.setState({
          isFiguresLoading: false,
          nbProducts: 0,
          nbServices: 0,
          nbShops: 0
        });
      }); 
    }

    refreshNews() { // Refresh the news.
      var self = this;
      self.setState({
        isNewsLoading: true
      });
      FeedService.search(this._request).then(function(feedServiceResult) {
        var news = feedServiceResult['_embedded'],
          navigation = feedServiceResult['_links']['navigation'];
        if (!(news instanceof Array)) {
          news = [news];
        }

        if (!(navigation instanceof Array)) {
          navigation = [navigation];
        }

        self.setState({
          isNewsLoading: false,
          news: news,
          navigation: navigation
        });
      }).catch(function() {
        self.setState({
          isNewsLoading: false,
          news: [],
          navigation: []
        });
      });
    }

    render() {
      var self = this;
      var settings = {
        dot: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      };
      const {t} = this.props;
      var news = [],
        navigations = [];
      if (this.state.navigation && this.state.navigation.length > 1) {
        this.state.navigation.forEach(function (nav) {
          navigations.push((
              <li className="page-item">
                <a href="#" className={self._page === nav.name ? "page-link active" : "page-link"} onClick={(e) => { self.navigate(e, nav.name); }}>
                  {nav.name}
                </a>
              </li>
          ));
        });
      }

      if (this.state.news) {
        this.state.news.forEach(function(n) {
          news.push((
            <li className="list-group-item row">
              <div className="col-md-3">
                <b>{n.author}</b><br/>
                Date : {moment(n.create_datetime).format('L')}
              </div>
              <div className="col-md-9">
                {n.description}
              </div>
            </li>
          ));
        });
      }

      return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
        {/* Slider */}
        <section className="jumbotron slider">
          <Slider {...settings}>
            <div>
              <div className="col-xs-12 col-md-8 col-md-offset-2 col-xl-6 col-xl-offset-6">
                <h2 className="white">{t('firstSlideDescription')}</h2>
              </div>
            </div>
            <div>
              <div className="col-xs-12 col-md-8 col-md-offset-2 col-xl-6 col-xl-offset-6">
                <h2 className="white">{t('secondSlideDescription')}</h2>
              </div>
            </div>
          </Slider>
        </section>
        {/* How to use ShopInGame ? */}
        <section>
          <div className="container">
            <div className="row">
              <div className="col-md-7">
                <h2>{t('howToUse')}</h2>
              </div>
              <div className="col-md-4">
                <div className="">
                  <span>{t('whoAreYou')}</span>
                  <select className="form-control" onChange={this.handleChangeUserType}>
                    <option>{t('aSeller')}</option>
                    <option>{t('aBuyer')}</option>
                  </select>
                </div>
              </div>
            </div>
            {this.state.isSellerExplanationVisible ? (
              <div className="container">
                <ul className="progressbar progressbar-withimage-counter row">
                  <li className="col-4"><div className="counter-rounded-img counter-rounded"><img src="/images/shop.png" /></div></li>
                  <li className="col-4"><div className="counter-rounded-img counter-rounded"><img src="/images/shelf.png" /></div></li>
                  <li className="col-4"><div className="counter-rounded-img counter-rounded"><img src="/images/listening.png" /></div></li>
                </ul>
                <div className="row">
                  <div className="col-md-4 center">
                    <h3 className="uppercase">{t('create')}</h3>
                    <p>{t('createDescription')}</p>
                  </div>
                  <div className="col-md-4 center">
                    <h3 className="uppercase">{t('feed')}</h3>
                    <p>{t('feedDescription')}</p>
                  </div>
                  <div className="col-md-4 center">

                    <h3 className="uppercase">{t('communicate')}</h3>
                    <p>{t('communicateDescription')}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="container">
                <ul className="progressbar progressbar-withimage-counter progressbar-red-theme row">
                  <li className="col-6"><div className="counter-rounded-img counter-rounded"><img src="/images/shopCart.png" /></div></li>
                  <li className="col-6"><div className="counter-rounded-img counter-rounded"><img src="/images/wallet.png" /></div></li>
                </ul>
                <div className="row">
                  <div className="col-md-6 center">
                    <h3 className="uppercase">{t('shopping')}</h3>
                    <p>{t('shoppingDescription')}</p>
                  </div>
                  <div className="col-md-6 center">
                    <h3 className="uppercase">{t('pay')}</h3>
                    <p>{t('payDescription')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        {/* Why ShopInGame ? */ }
        <section>
          <div className="container">
            <h2>{t('whyShopInGame')}</h2>
            <div className="row vertical-tabs-container">
              <div className="col-md-3 col-lg-3 col-sm-3 col-xs-3 vertical-tabs-menu">
                <div className="list-group">
                  <a href="#" className={this.state.activeTab === '1' ? "list-group-item text-center active" : "list-group-item text-center"} onClick={(e) => { this.toggleTab(e, '1') }}>
                    {this.state.activeTab === '1' ? (<img src="/images/shopCart-White.png" />) : (<img src="/images/shopCart.png" />)}
                    <br />
                    <span>{t('shopping')}</span>
                  </a>
                  <a href="#" className={this.state.activeTab === '2' ? "list-group-item text-center active" : "list-group-item text-center"}  onClick={(e) => { this.toggleTab(e, '2') }}>
                    {this.state.activeTab === '2' ? (<img src="/images/user-White.png" />) : (<img src="/images/user.png" />)}
                    <br />
                    <span>{t('madeForBuyers')}</span>
                  </a>
                  <a href="#" className={this.state.activeTab === '3' ? "list-group-item text-center active" : "list-group-item text-center"}  onClick={(e) => { this.toggleTab(e, '3') }}>
                    {this.state.activeTab === '3' ? (<img src="/images/shop-White.png" />) : (<img src="/images/shop.png" />)}
                    <br />
                    <span>{t('madeForSellers')}</span>
                  </a>
                </div>
              </div>
              <div className="col-md-9 col-lg-9 col-sm-9 col-xs-9">
                {this.state.activeTab === '1' ? (
                  <div className="tab-1">
                    <h2>{t('navigation')}</h2>
                    <p dangerouslySetInnerHTML={{__html: t('navigationDescription')}}></p>
                  </div>
                ) : (this.state.activeTab === '2' ? (
                  <div className="tab-2">
                    <h2>{t('madeForBuyers')}</h2>
                    <p dangerouslySetInnerHTML={{ __html: t('madeForBuyersDescription')}}></p>
                  </div>
                ) : (
                  <div className="tab-3">
                    <h2>{t('madeForSellers')}</h2>
                    <p dangerouslySetInnerHTML={{ __html: t('madeForSellersDescription')}}></p>                      
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Some figures */}
        <section>
          <div className="container">
            <h2>{t('someFigures')}</h2>
            { this.state.isFiguresLoading && (<i className='fa fa-spinner fa-spin'></i>) }
            { !this.state.isFiguresLoading && (
              <div className="row">
                <div className="col-md-4 text-center">
                  <img src="/images/shop.png" />
                  <h3 className="uppercase">{t('shops')}</h3>
                  <span className="counter-number">{this.state.nbShops}</span>
                </div>
                <div className="col-md-4 text-center">
                  <img src="/images/product.png" />
                  <h3 className="uppercase">{t('products')}</h3>
                  <span className="counter-number">{this.state.nbProducts}</span>
                </div>
                <div className="col-md-4 text-center">
                  <img src="/images/information.png" />
                  <h3 className="uppercase">{t('services')}</h3>
                  <span  className="counter-number">{this.state.nbServices}</span>
                </div>
              </div>
            )}
          </div>
        </section>
        {/* News */}
        <section>
          <div className="container">
            <h2>
              {t('news')} <a href={Constants.apiUrl + '/feeditems'} target='_blank'><img src="/images/rss.png" /></a>
            </h2>
            { news.length === 0 && (<i>{t('noNews')}</i>) }
            { news.length > 0 && (
              <ul className="list-group">
                {news}
              </ul>
            )}
            {navigations.length > 0 && (
              <ul className="pagination">
                {navigations}
              </ul>
            )}
          </div>
        </section>
      </MainLayout>);
    }

    componentDidMount() {
      this.refreshFigures();
      this.refreshNews();
    }
}


export default translate('common', { wait: process && !process.release })(Home);
