import React, { Component } from "react";
import MainLayout from './MainLayout';
import { translate } from 'react-i18next';

class Message extends Component {
  render() { // Display component.
    return (
      <MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
        <div className="container">
          <h2>Message</h2>
          <div className="section" style={{padding: "20px"}}>
            <div className="row">
              <div className="col-md-6">
                <div style={{borderRadius: "5px", float: "left", backgroundColor: "gray"}}>
                  Quanta autem vis amicitiae sit, ex hoc intellegi maxime potest, quod ex infinita societate generis humani, quam conciliavit ipsa natura, ita contracta res est et adducta in angustum ut omnis caritas aut inter duos aut inter paucos iungeretur.
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 offset-md-6">
                <div style={{borderRadius: "5px", float: "right", backgroundColor: "red", color: "white"}}>
                  Quanta autem vis amicitiae sit, ex hoc intellegi maxime potest, quod ex infinita societate generis humani, quam conciliavit ipsa natura, ita contracta res est et adducta in angustum ut omnis caritas aut inter duos aut inter paucos iungeretur.
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div style={{borderRadius: "5px", float: "left", backgroundColor: "gray"}}>
                  Quanta autem vis amicitiae sit, ex hoc intellegi maxime potest, quod ex infinita societate generis humani, quam conciliavit ipsa natura, ita contracta res est et adducta in angustum ut omnis caritas aut inter duos aut inter paucos iungeretur.
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 offset-md-6">
                <div style={{borderRadius: "5px", float: "right", backgroundColor: "red", color: "white"}}>
                  Quanta autem vis amicitiae sit, ex hoc intellegi maxime potest, quod ex infinita societate generis humani, quam conciliavit ipsa natura, ita contracta res est et adducta in angustum ut omnis caritas aut inter duos aut inter paucos iungeretur.
                </div>
              </div>
            </div>
            <form>
              <textarea className="form-control" />
              <button className="btn btn-default">Add comment</button>
            </form>
          </div>
        </div>
      </MainLayout>
    );
  }

  componentDidMount() { // Execute before the render.

  }
}

export default translate('common', { wait: process && !process.release })(Message);
