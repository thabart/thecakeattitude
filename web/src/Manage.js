import React, {Component} from "react";
import { ManageAnnounces, ManageShops } from './manageTabs/index';
import { UserProfile } from './users/index';
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router";
import { translate } from 'react-i18next';
import { ApplicationStore } from './stores/index';
import MainLayout from './MainLayout';

class Manage extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isVerticalMenuDisplayed: true
    };
  }

  toggle(name) { // Toggle property.
    this.setState({
      [name] : !this.state[name]
    })
  }

  render() { // Render the view.
    const {t} = this.props;
    var self = this;
    var action = self.props.match.params.action;
    var subaction = self.props.match.params.subaction || 'view';
    var sub = ApplicationStore.getUser().sub;
    var content = (<UserProfile sub={sub} isEditable={subaction === 'edit'} canBeEdited={true} />);
    if (action === "announces") {
      content = (<ManageAnnounces />);
    } else if (action === "shops") {
      content = (<ManageShops />);
    }

    return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={false}>
        <div className="row" id="manage-profile">
            <nav className={self.state.isVerticalMenuDisplayed ? "col-md-2 hidden-sm-down vertical-menu fixed" : "vertical-menu hidden-sm-down min fixed"} style={{zIndex : "1029"}}>
              <div className="header">
                <i className="fa fa-bars" onClick={() => self.toggle('isVerticalMenuDisplayed')}></i>
              </div>
              {this.state.isVerticalMenuDisplayed ? (
                <ul>
                  <li className="menu-item hoverable">
                    <NavLink to="/manage/profile" className="nav-link"><h3 className="uppercase"><img src="/images/user.png" width="30" /> {t('profile')}</h3></NavLink>
                  </li>
                  <li className="menu-item hoverable">
                    <NavLink to="/manage/shops" className="nav-link"><h3 className="uppercase"><img src="/images/shop.png" width="30" /> {t('shops')}</h3></NavLink>
                  </li>
                </ul>
              ) : (
                <ul>
                  <li className="menu-item hoverable">
                    <NavLink to="/manage/profile" className="nav-link"><img src="/images/user.png" width="30" /></NavLink>
                  </li>
                  <li className="menu-item hoverable">
                    <NavLink to="/manage/shops" className="nav-link"><img src="/images/shop.png" width="30" /></NavLink>
                  </li>
                </ul>
              )}
            </nav>
            <section className={self.state.isVerticalMenuDisplayed ? "col-md-10 offset-md-2" : "col-md-12"}>
              {content}
            </section>
        </div>
    </MainLayout>);
  }

  componentDidMount() {
    console.log('coucou3');
  }
}

export default translate('common', { wait: process && !process.release })(withRouter(Manage));
