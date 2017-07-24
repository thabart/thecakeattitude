import React, {Component} from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./styles/home.css";

class Home extends Component {
    constructor(props) {
      super(props);
      this.handleChangeUserType = this.handleChangeUserType.bind(this);
      this.toggleTab = this.toggleTab.bind(this);
      this.state = {
        isSellerExplanationVisible : true,
        activeTab : '1'
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
    render() {
      var settings = {
        dot: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      };
      return (<div>
        {/* Slider */}
        <section className="jumbotron slider">
          <Slider {...settings}>
            <div>
              <div className="col-xs-12 col-md-8 col-md-offset-2 col-xl-6 col-xl-offset-6">
                <h2 className="font-secondary">Vous pensez qu il serait temps de vendre des produits ou même vos services? Venez vite ouvrir votre vitrine virtuelle !</h2>
              </div>
            </div>
            <div>
              <div className="col-xs-12 col-md-8 col-md-offset-2 col-xl-6 col-xl-offset-6">
                <h2 className="font-secondary">Un site pensé pour les vendeurs particuliers ou professionels mais aussi les acheteurs</h2>
              </div>
            </div>
          </Slider>
        </section>
        {/* How to use ShopInGame ? */}
        <section>
          <div className="container">
            <div className="row">
              <div className="col-md-7">
                <h2 className="font-secondary redColor">Comment utiliser ShopInGame ?</h2>
              </div>
              <div className="col-md-4">
                <div className="">
                  <span>Qui êtes vous ?</span>
                  <select className="form-control" onChange={this.handleChangeUserType}>
                    <option>Un vendeur</option>
                    <option>Un acheteur</option>
                  </select>
                </div>
              </div>
            </div>
            {this.state.isSellerExplanationVisible ? (
              <div className="container">
                <ul className="progressbar progressbar-withimage-counter progressbar-red-theme row">
                  <li className="col-4"><div className="counter-rounded-img counter-rounded"><img src="/images/shop.png" /></div></li>
                  <li className="col-4"><div className="counter-rounded-img counter-rounded"><img src="/images/shelf.png" /></div></li>
                  <li className="col-4"><div className="counter-rounded-img counter-rounded"><img src="/images/listening.png" /></div></li>
                </ul>
                <div className="row">
                  <div className="col-md-4 center">
                    <h3 className="uppercase">Créer</h3>
                    <p>Créez un magasin d habits / pâtisserie / électronique ou même de seconde main.</p>
                  </div>
                  <div className="col-md-4 center">
                    <h3 className="uppercase">Alimenter</h3>
                    <p>Alimentez vos rayons avec quelques produits.</p>
                  </div>
                  <div className="col-md-4 center">

                    <h3 className="uppercase">Communiquer</h3>
                    <p>Améliorez votre visibilité en choisissant le meilleur emplacement dans le jeux et venez communiquer avec des clients potentiels directement sur le jeux.</p>
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
                    <h3 className="uppercase">Courses</h3>
                    <p>Faîtes vos courses parmi les magasins disponibles.</p>
                  </div>
                  <div className="col-md-6 center">
                    <h3 className="uppercase">Payer</h3>
                    <p>Passez la commande et effectuez la transaction dès réception du produit.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        {/* Why ShopInGame ? */ }
        <section>
          <div className="container">
            <h2 className="font-secondary redColor">Pourquoi ShopInGame ?</h2>
            <div className="row vertical-tabs-container">
              <div className="col-md-3 col-lg-3 col-sm-3 col-xs-3 vertical-tabs-menu">
                <div className="list-group">
                  <a href="#" className={this.state.activeTab === '1' ? "list-group-item text-center active" : "list-group-item text-center"} onClick={(e) => { this.toggleTab(e, '1') }}>
                    {this.state.activeTab === '1' ? (<img src="/images/shopCart-White.png" />) : (<img src="/images/shopCart.png" />)}
                    <br />
                    <span>Courses</span>
                  </a>
                  <a href="#" className={this.state.activeTab === '2' ? "list-group-item text-center active" : "list-group-item text-center"}  onClick={(e) => { this.toggleTab(e, '2') }}>
                    {this.state.activeTab === '2' ? (<img src="/images/user-White.png" />) : (<img src="/images/user.png" />)}
                    <br />
                    <span>Pensé pour les clients</span>
                  </a>
                  <a href="#" className={this.state.activeTab === '3' ? "list-group-item text-center active" : "list-group-item text-center"}  onClick={(e) => { this.toggleTab(e, '3') }}>
                    {this.state.activeTab === '3' ? (<img src="/images/shop-White.png" />) : (<img src="/images/shop.png" />)}
                    <br />
                    <span>Pensé pour les vendeurs</span>
                  </a>
                </div>
              </div>
              <div className="col-md-9 col-lg-9 col-sm-9 col-xs-9">
                {this.state.activeTab === '1' ? (
                  <div className="tab-1">
                    <h2 className="font-secondary">Navigation</h2>
                    <p>ShopInGame réinvente la façon de faire ses achats en ligne en ajoutant une dimension ludique sous forme de jeux multi-joueur.</p>
                  </div>
                ) : (this.state.activeTab === '2' ? (
                  <div className="tab-2">
                    <h2 className="font-secondary">Pensé pour les clients</h2>
                    <p>
                      ShopInGame a été conçu pour les clients en offrant les services suivant :
                      <ul className="with-default-style">
                        <li>
                          Rechercher des magasins selon différents critères de recherche
                          <ul className="with-default-style">
                            <li>Géographique (par exemple : les magasins les plus proches)</li>
                            <li>Tags (par exemple : les magasins écologique)</li>
                            <li>Produits</li>
                            <li>Ou simplement en se baladant et discutant sur le jeux</li>
                          </ul>
                        </li>
                        <li>
                          Soumettre une demande à une communauté de vendeurs par exemple : je veux un gâteau d anniversaire pour mon fils, cette demande sera envoyée aux magasins de pâtisserie.
                        </li>
                      </ul>
                    </p>
                  </div>
                ) : (
                  <div className="tab-3">
                    <h2 className="font-secondary">Pensé pour les vendeurs</h2>
                    <p>
                      ShopInGame a été conçu pour les vendeurs en offrant les services suivants :
                      <ul className="with-default-style">
                        <li>Créer une vitrine virtuelle et y ajouter des produits.</li>
                        <li>Proposer des services aux clients par exemple : <i>Tous les samedis matin je propose de rénover vos chaussures.</i></li>
                        <li>Rentrer facilement en contact avec les clients.</li>
                        <li>Une gestion end-to-end du processus d achat.</li>
                      </ul>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Some figures */}
        <section>
          <div className="container">
            <h2 className="font-secondary redColor">Quelques chiffres</h2>
            <div className="row">
              <div className="col-md-4 text-center">
                <img src="/images/shop.png" />
                <h3 className="counter-title">Magasins</h3>
                <span className="counter-number">100</span>
              </div>
              <div className="col-md-4 text-center">
                <img src="/images/product.png" />
                <h3>Produits</h3>
                <span className="counter-number">200</span>
              </div>
              <div className="col-md-4 text-center">
                <img src="/images/information.png" />
                <h3>Services</h3>
                <span  className="counter-number">300</span>
              </div>
            </div>
          </div>
        </section>
        {/* News */}
        <section>
          <div className="container">
            <h2 className="font-secondary redColor">
              Actualités <a href="#"><img src="/images/rss.png" /></a>
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
      </div>);
    }

    componentDidMount() {
        var self = this;
    }
    componentWillUnmount() {
    }
}


export default Home;
