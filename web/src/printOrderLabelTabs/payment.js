import React, {Component} from "react";
import { translate } from 'react-i18next';

class Payment extends Component {
  constructor(props) {
    super(props);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
  }

  previous() { // Execute when the user clicks on previous.
    if (this.props.onPrevious) {
      this.props.onPrevious();
    }
  }

  next() { // Execute when the user clicks on next.
    if (this.props.onNext) {
      this.props.onNext();
    }
  }

  render() { // Display the component.
    const {t} = this.props;
    return (<div>
      <div>
        <button className="btn btn-default" onClick={this.previous}>{t('previous')}</button>
        <button className="btn btn-default" style={{marginLeft: "5px"}} onClick={this.next}>{t('next')}</button>
      </div>
    </div>);
  }
}

export default translate('common', { wait: process && !process.release })(Payment);
