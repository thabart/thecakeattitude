import React, {Component} from "react";
import MainLayout from './MainLayout';
import { translate } from 'react-i18next';

class Notifications extends Component {
    constructor(props) {
      super(props);
    }

    render() { // Render the view.
      const {t} = this.props;
      return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
        <div className="container">
          <h2>{t('yourNotifications')}</h2>
          <ul className="list-group-default list-group-default-border">
            <li>
              <div className="row" style={{padding:"0px 5px 0px 5px"}}>
                <div className="col-md-2"><b>Administrator</b></div>
                <div className="col-md-8"><p>Illud autem non dubitatur quod cum esset aliquando virtutum omnium domicilium Roma, ingenuos advenas plerique nobilium, ut Homerici bacarum suavitate Lotophagi, humanitatis multiformibus officiis retentabant.</p></div>
                <div className="col-md-2"><i className="fa fa-eye"></i><i className="fa fa-link"></i></div>
              </div>
            </li>
            <li>
              <div className="row" style={{padding:"0px 5px 0px 5px"}}>
                <div className="col-md-2"><b>Administrator</b></div>
                <div className="col-md-8"><p>Illud autem non dubitatur quod cum esset aliquando virtutum omnium domicilium Roma, ingenuos advenas plerique nobilium, ut Homerici bacarum suavitate Lotophagi, humanitatis multiformibus officiis retentabant.</p></div>
                <div className="col-md-2"><i className="fa fa-eye"></i><i className="fa fa-link"></i></div>
              </div>
            </li>
            <li>
              <div className="row" style={{padding:"0px 5px 0px 5px"}}>
                <div className="col-md-2"><b>Administrator</b></div>
                <div className="col-md-8"><p>Illud autem non dubitatur quod cum esset aliquando virtutum omnium domicilium Roma, ingenuos advenas plerique nobilium, ut Homerici bacarum suavitate Lotophagi, humanitatis multiformibus officiis retentabant.</p></div>
                <div className="col-md-2"><i className="fa fa-eye"></i><i className="fa fa-link"></i></div>
              </div>
            </li>
            <li>
              <div className="row" style={{padding:"0px 5px 0px 5px"}}>
                <div className="col-md-2"><b>Administrator</b></div>
                <div className="col-md-8"><p>Illud autem non dubitatur quod cum esset aliquando virtutum omnium domicilium Roma, ingenuos advenas plerique nobilium, ut Homerici bacarum suavitate Lotophagi, humanitatis multiformibus officiis retentabant.</p></div>
                <div className="col-md-2"><i className="fa fa-eye"></i><i className="fa fa-link"></i></div>
              </div>
            </li>
          </ul>
          <ul className="pagination">
            <li className="page-item"><a href="#" className="page-link">1</a></li>
            <li className="page-item"><a href="#" className="page-link">2</a></li>
          </ul>
        </div>
      </MainLayout>);
    }

    componentDidMount() {
        var self = this;
    }
}

export default translate('common', { wait: process && !process.release })(Notifications);
