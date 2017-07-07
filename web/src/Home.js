import React, {Component} from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./styles/home.css";

class Home extends Component {
    constructor(props) {
        super(props);
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
                  <select className="form-control">
                    <option>Un vendeur</option>
                    <option>Un acheteur</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="row">
                <div className="col-md-4 center">
                  <i className="fa fa-building-o i-large"></i>
                  <h3 className="uppercase">Vitrine</h3>
                  <p>Créez votre magasin et choisissez son emplacement dans le jeux</p>
                </div>
                <div className="col-md-4 center">
                  <i className="fa fa-money i-large"></i>
                  <h3 className="uppercase">Paiement</h3>
                  <p>Choisissez vos moyens de paiement</p>
                </div>
                <div className="col-md-4 center">
                  <i className="fa fa-plus i-large"></i>
                  <h3 className="uppercase">Rayonnage</h3>
                  <p>Commencez à ajouter quelques produits ...</p>
                </div>
              </div>
            </div>
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
