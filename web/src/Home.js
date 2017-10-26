import React, {Component} from "react";
import { translate } from 'react-i18next';
import { StatsService } from './services/index';
import MainLayout from './MainLayout';
import Constants from '../Constants';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./styles/home.css";

class Home extends Component {
    constructor(props) {
      super(props);
      this.handleChangeUserType = this.handleChangeUserType.bind(this);
      this.toggleTab = this.toggleTab.bind(this);
      this.refresh = this.refresh.bind(this);
      this.state = {
        isFiguresLoading: false,
        isSellerExplanationVisible : true,
        activeTab : '1',
        nbProducts: 0,
        nbServices: 0,
        nbShops: 0
      };
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

    refresh() { // Refresh all the figures.
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

    render() {
      var settings = {
        dot: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      };
      const {t} = this.props;
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
            <h2>Pourquoi ShopInGame ?</h2>
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
            <ul className="list-group">
              <li className="list-group-item row">
                <div className="col-md-3">
                  <b>Thierry Habart</b><br/>
                  Date : 24-07-2017
                </div>
                <div className="col-md-9">
                  Vous pouvez dorénavant vous désabonner de certains feeds.
                </div>
              </li>
              <li className="list-group-item row">
                <div className="col-md-3">
                  <b>Laetitia Buyse</b><br/>
                  Date : 24-07-2017
                </div>
                <div className="col-md-9">
                  Paypal est maintenant supporté.
                </div>
              </li>
            </ul>
            <ul className="pagination">
              <li className="page-item"><a className="page-link" href="#">1</a></li>
              <li className="page-item"><a className="page-link" href="#">2</a></li>
              <li className="page-item"><a className="page-link" href="#">3</a></li>
            </ul>
          </div>
        </section>
      </MainLayout>);
    }

    componentDidMount() {
      this.refresh();
    }
}


export default translate('common', { wait: process && !process.release })(Home);
