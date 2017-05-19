import React, {Component} from "react";

class CharacteristicsTab extends Component {
  constructor(props) {
    super(props);
    this.previous = this.previous.bind(this);
    this.confirm = this.confirm.bind(this);
  }
  previous() {
    this.props.previous();
  }
  confirm() {
    this.props.confirm();
  }
  render() {
    return (<div>
        <section className="row section">
        </section>
        <section className="col-md-12 sub-section">
            <button className="btn btn-primary previous" onClick={this.previous}>Previous</button>
            <button className="btn btn-success next" onClick={this.confirm}>Confirm</button>
        </section>
      </div>);
  }
}

export default CharacteristicsTab;
