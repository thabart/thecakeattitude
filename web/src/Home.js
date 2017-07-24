import React, {Component} from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./styles/home.css";

class Home extends Component {
    constructor(props) {
      super(props);
      this.handleChangeUserType = this.handleChangeUserType.bind(this);
      this.state = {
        isSellerExplanationVisible : true
      };
    }
    handleChangeUserType() {
      this.setState({
        isSellerExplanationVisible: !this.state.isSellerExplanationVisible
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
        <section>
          <div className="container">
            <h2 className="font-secondary redColor">Pourquoi ShopInGame ?</h2>
            <div className="row">

            </div>
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
