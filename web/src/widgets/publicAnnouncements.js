import React, {Component} from "react";
import Widget from "../components/widget";
import { AnnouncementsService } from '../services/index';
import {Button} from 'reactstrap';
import $ from 'jquery';
import AppDispatcher from "../appDispatcher";

class PublicAnnouncements extends Component {
    constructor(props) {
        super(props);
        this.navigate = this.navigate.bind(this);
        this.showDetails = this.showDetails.bind(this);
        this.localize = this.localize.bind(this);
        this.state = {
            errorMessage: null,
            isLoading: false,
            announcements: [],
            navigation: [],
            details: {}
        };
    }
    localize(e, announcement) {
      e.preventDefault();
      e.stopPropagation();
      this.props.setCurrentMarker(announcement.id);
    }
    showDetails(id, isDetailDisplayed) {
      var details = this.state.details;
      details[id] = !isDetailDisplayed;
      this.setState({
        details : details
      });
    }
    reset() {
      this.setState({
          announcements: [],
          navigation: []
      });
    }
    refresh(json) {
        var request = $.extend({}, json, {
            orders: [
                {target: "update_datetime", method: "desc"}
            ],
            count: 5
        });
        this.request = request;
        this.display(request);
    }
    navigate(e, name) {
        e.preventDefault();
        var startIndex = name - 1;
        var request = $.extend({}, this.request, {
            start_index: startIndex
        });
        this.display(request);
    }
    display(request) {
        var self = this;
        self.setState({
            isLoading: true
        });
        AnnouncementsService.search(request).then(function (r) {
            var announcements = r['_embedded'],
                navigation = r['_links']['navigation'];
            if (!(announcements instanceof Array)) {
                announcements = [announcements];
            }
            if (!(navigation instanceof Array)) {
                navigation = [navigation];
            }

            self.setState({
                announcements: announcements,
                navigation: navigation,
                isLoading: false
            });
        }).catch(function () {
            self.setState({
                announcements: [],
                navigation: [],
                isLoading: false
            });
        });
    }
    enableMove(b) {
      this.refs.widget.enableMove(b);
    }
    render() {
        var title = "Public announcements",
          content = [],
          navigations = [],
          self = this;
        if (this.state.isLoading) {
            return (
                <Widget title={title} onClose={this.props.onClose} ref="widget">
                    <i className='fa fa-spinner fa-spin'></i>
                </Widget>);
        }

        if (self.state.announcements && self.state.announcements.length > 0) {
          self.state.announcements.forEach(function (announcement) {
            var image = "/images/default-announcement.jpg";
            var days = (<span>No announces</span>);
            var isDetailsDisplayed = self.state.details[announcement.id] && self.state.details[announcement.id] !== null;
            content.push((
              <li key={announcement.id} className="list-group-item list-group-item-action no-padding row">
                <div className="summary">
                  <div className="first-column"><img src={image} className="img-thumbnail rounded picture image-small"/></div>
                  <div className="second-column">
                    <div>{announcement.name}</div>
                    {announcement.category && announcement.category !== null && <div>Belongs to the category <b>{announcement.category.name}</b></div>}
                  </div>
                    <div className="last-column">
                      <Button outline color="secondary" size="sm" onClick={(e) => { self.localize(e, announcement); }}>
                        <i className="fa fa-map-marker localize"></i>
                      </Button>
                      {announcement.price > 0 && (
                        <h5 className="price">Proposed price € {announcement.price}</h5>
                      )}
                    </div>
                  <div className="expander" onClick={(e) => { e.preventDefault(); self.showDetails(announcement.id, isDetailsDisplayed); }}>
                    {isDetailsDisplayed ? (<span>Close details</span>) : (<span>More details</span>)}
                  </div>
                </div>
                {isDetailsDisplayed && (
                  <div className="details">
                    <table className="table">
                      <tbody>
                        <tr>
                          <td>Description</td>
                          <td>{announcement.description}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </li>));
          });
        }

        if (self.state.navigation && self.state.navigation.length > 1) {
          self.state.navigation.forEach(function (nav) {
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
                    ? (<span>No announces</span>) :
                    (<ul className="list-group list-group-flush">
                        {content}
                    </ul>)
                }
            </Widget>
        );
    }
    componentWillMount() {
        var self = this;
        AppDispatcher.register(function (payload) {
            switch (payload.actionName) {
                case 'add-announce':
                case 'remove-announce':
                    var request = $.extend({}, self.request, {
                        start_index: 0
                    });
                    self.refresh(request);
                    break;
            }
        });
    }
}

export default PublicAnnouncements;
