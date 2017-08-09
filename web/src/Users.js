import React, {Component} from "react";
import { translate } from 'react-i18next';
import { UserProfile } from './users/index';
import MainLayout from './MainLayout';

class Users extends Component {
  constructor(props) {
    super(props);
  }

  render() { // Display the view.
    return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
      <UserProfile sub={this.props.match.params.id} canBeEdited={false} />
    </MainLayout>);
  }
}

export default translate('common', { wait: process && !process.release })(Users);
