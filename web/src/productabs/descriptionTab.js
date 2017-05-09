import React, { Component } from 'react';
import './descriptionTab.css';

class DescriptionTab extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    var characteristics = [];
    if (this.props.product.filters) {
      var groupedFilters = {};
      this.props.product.filters.forEach(function(filter) {
        var record = groupedFilters[filter.filter_id];
        if (!record) {
          groupedFilters[filter.filter_id] = { label: filter.name, content : [ filter.content ] };
        } else {
          record.content.push(filter.content);
        }
      });

      for (var groupedFilter in groupedFilters) {
        var o = groupedFilters[groupedFilter];
        characteristics.push((<tr><td>{o.label}</td><td>{o.content.join(',')}</td></tr>));
      }
    }

    return (
      <div className="row description-tab">
        <h5 className="col-md-12 title">Description</h5>
        <p className="col-md-12">
          {this.props.product.description}
        </p>
        <h5 className="col-md-12 title">Characteristics</h5>
        {characteristics.length === 0 ? (<span>No characteristics</span>) : (
          <table className="table table-striped">
            <tbody>
              {characteristics}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

export default DescriptionTab;
