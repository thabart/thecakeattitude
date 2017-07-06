import React, {Component} from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
        <div className="jumbotron">
          <Slider {...settings}>
            <div>
              <div className="col-xs-12 col-md-8 col-md-offset-2 col-xl-6 col-xl-offset-6">
                <h2>Vous pensez qu il serait bien de vendre des produits ou même vos services? Venez vite ouvrir votre vitrine virtuelle !</h2>
              </div>
            </div>
            <div>
              <div className="col-xs-12 col-md-8 col-md-offset-2 col-xl-6 col-xl-offset-6">
                <h2>Un site pensé pour les vendeurs particuliers ou professionels mais aussi les acheteurs</h2>
              </div>
            </div>
          </Slider>
        </div>
        <div>
          <img src="/images/computer-presentation.png" width="600" />
        </div>
        <div>
          <p>Comment utiliser ShopInGame ?</p>
          <ul>
            <li>
              En tant que vendeur
            </li>
            <li>
              En tant qu acheteur
            </li>
          </ul>
          <div>
            <ul>
              <li>
                <div>
                  Créer votre magasin
                </div>
                <div>
                  Choisissez la catégorie à laquelle appartient votre magasin, et choisissez son emplacement dans le jeux.
                </div>
              </li>
              <li>
                <div>
                  Moyens de paiement
                </div>
                <div>
                  Choisissez les moyens de paiement acceptés.
                </div>
              </li>
              <li>
                <div>
                  Rayonnage
                </div>
                <div>
                  Ajoutez des produits & placez les dans vos rayons.
                </div>
              </li>
            </ul>
          </div>
          <div>
            <ul>
              <li>
                <div>
                  Visitez
                </div>
                <div>
                  Visitez les magasins au travers le site ou le jeux.
                </div>
              </li>
              <li>
                <div>
                  Achetez
                </div>
                <div>
                  Achetez les produits via les moyens de paiement acceptés par le magasin.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>);
    }

    componentDidMount() {
        var self = this;
    }
    componentWillUnmount() {
    }
}


export default Home;
