import React, {Component} from "react";
import {AnnouncementsService, SessionService} from '../services/index';

class ManageAnnounces extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }
  refresh() {
    var self = this;
    self.setState({
      isLoading: true
    });
    AnnouncementsService.searchMineAnnouncements({ start_index: 0, count: 10 })
      .then(function(result) {
        console.log(result);
        self.setState({
          isLoading: false
        });
      }).catch(function() {
        self.setState({
          isLoading: false
        });
      });
  }
  render() {
    if (this.state.isLoading) {
      return (<div><i className="fa fa-spinner fa-spin"></i></div>);
    }

    return (<div>
      <h1>Manage announces</h1>

    </div>);
  }
  componentDidMount() {
    this.refresh();
  }
}

export default ManageAnnounces;
