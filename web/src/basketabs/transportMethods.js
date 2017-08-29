import React, { Component } from "react";
import { Button } from "reactstrap";
import { translate } from 'react-i18next';

class TransportMethods extends Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
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
    const { t } = this.props;
    return (
      <div className="container rounded">
        <p>Choose a transport method.</p>
        <div className="col-md-12">
          <section className="row p-1">
          </section>
          <section className="row p-1">
            <Button color="default" onClick={this.previous}>{t('previous')}</Button>
            <Button color="default" onClick={this.next} style={{marginLeft:"5px"}}>{t('next')}</Button>
          </section>
        </div>
      </div>
    );
  }
}

export default translate('common', { wait: process && !process.release })(TransportMethods);
