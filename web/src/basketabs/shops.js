import React, { Component } from "react";
import { Button } from "reactstrap";
import { translate } from 'react-i18next';

class Shops extends Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
  }

  next() { // Execute when the user click on next.
    if (this.props.onNext) {
      this.props.onNext();
    }
  }

  render() { // Display the component.
    const { t } = this.props;
    return (
      <div className="container rounded">
        <p>Select for which shop you want to purchase the items</p>
        <div className="col-md-12">
          <section className="row p-1">
            <Button color="default" onClick={this.next}>{t('next')}</Button>
          </section>
        </div>
      </div>
    );
  }
}

export default translate('common', { wait: process && !process.release })(Shops);
