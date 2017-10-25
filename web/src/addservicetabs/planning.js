import React, {Component} from "react";
import { UncontrolledTooltip, FormGroup, FormFeedback, Label } from 'reactstrap';
import { translate } from 'react-i18next';
import { EditableShopServicePlanning } from '../components/index';
import DatePicker from "react-datepicker";
import TimePicker from 'rc-time-picker';
import moment from "moment";

class PlanningTab extends Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  next() { // Next
  }

  previous() { // Previous.
    if (this.props.onPrevious) this.props.onPrevious();
  }

  confirm() { // Confirm.
    console.log(this.refs.editablePlanning);
    var json = this.refs.editablePlanning.getWrappedInstance().validate();
    if (!json || json === null) { return; }    
    if (this.props.onNext) this.props.onNext(json);
  }

  render() { // Render the component.
    const {t} = this.props;
    return (<div className="container bg-white rounded">
      <section className="row p-1">
        <div className="col-md-12">
          {/* Information */ }
          <FormGroup>
            <p dangerouslySetInnerHTML={{__html: t('addShopServiceOccurrenceDescription')}}></p>
            <ul className="no-padding tags gray">
              <li>{t('monday')}</li>
              <li>{t('wednesday')}</li>
            </ul>
          </FormGroup>
          <EditableShopServicePlanning ref="editablePlanning" />
        </div>
      </section>
      <section className="row p-1">
          <button className="btn btn-default" onClick={this.previous}>{t('previous')}</button>
          <button className="btn btn-default" style={{marginLeft: "5px"}} onClick={this.confirm}>{t('confirm')}</button>
      </section>
  </div>);
  }
}

export default translate('common', { wait: process && !process.release })(PlanningTab);
