import React, { Component } from 'react';
import {Tooltip} from "reactstrap";
import TagsInput from "react-tagsinput";
import $ from 'jquery';
import {Guid} from '../utils';

class ShopProductFilter extends Component {
  constructor(props) {
    super(props);
    this._indexFilter = 0;
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.addFilterLine = this.addFilterLine.bind(this);
    this.renderTag = this.renderTag.bind(this);
    this.state = {
      tooltip:  {},
      filters: props.filters || []
    };
  }
  toggleTooltip(name) {
      var tooltip = this.state.tooltip;
      tooltip[name] = !tooltip[name];
      this.setState({
          tooltip: tooltip
      });
  }
  addFilterLine() {
    var filters = this.state.filters;
    filters.push({
      id: this._indexFilter,
      externalId: Guid.generate(),
      tags: [],
      name: '',
      isNotComplete: true
    });
    this.setState({
      filters: filters
    });
    this._indexFilter++;
  }
  isTagsExist(tags, changed, changedIndexes, innerTags) {
    if (changedIndexes[0] === innerTags.length ) {
      var changedValue = changed[0].toLowerCase();
      var selectedValue = innerTags.filter(function(tag) {
        return tag.content.toLowerCase() === changedValue;
      });

      if (selectedValue.length > 0) {
        return true;
      }
    }

    return false;
  }
  getFilter(filter, filters) {
    var sf = null;
    filters.forEach(function(f) {
      if (f.id === filter.id) {
        sf = f;
        return;
      }
    });

    return sf;
  }
  getFilters() {
    return this.state.filters;
  }
  renderTag(props) {
    let {tag, key, disabled, onRemove, classNameRemove, getTagDisplayValue, ...other} = props;
    return (<span key={key} {...other}>
      {tag.content}
      {!disabled &&
        <a className={classNameRemove} onClick={(e) => onRemove(key)} />
      }
    </span>);
  }
  render() {
    var filters = [],
      self = this;
    if (this.state.filters && this.state.filters.length > 0) {
      this.state.filters.forEach(function(filter) {
        filters.push(<div className="row col-md-12">
          <div className="col-md-4"><input type="text" className="form-control" value={filter.name} placeholder="Filter name" onChange={(e) => {
            var fs = self.state.filters.slice(0);
            var sf = self.getFilter(filter, fs);
            if (sf === null) {
              return;
            }

            sf.name = e.target.value;
            var names = fs.filter(function(m) { return m.name.toLowerCase() === e.target.value.toLowerCase(); });
            sf.isCorrect = names.length <= 1;
            sf.isNotComplete = e.target.value === null || e.target.value === '' || sf.tags.length === 0;
            self.setState({
              filters: fs
            });
          }} /></div>
          <div className="col-md-6"><TagsInput value={filter.tags} onChange={(tags, changed, changedIndexes) => {
            var fs = self.state.filters.slice(0);
            var sf = self.getFilter(filter, fs);
            if (sf === null) {
              return;
            }

            if (self.isTagsExist(tags, changed, changedIndexes, sf.tags)) {
                return;
            }

            var arr = [];
            tags.forEach(function(t) {
              if (typeof t === 'string') {
                arr.push({
                  id: Guid.generate(),
                  content: t
                });
              } else {
                arr.push(t);
              }
            });

            sf.tags = arr;
            sf.isNotComplete = sf.name === null || sf.name === '' || sf.tags.length === 0;
            self.setState({
              filters: fs
            });
          }}   inputProps={{placeholder: "Values"}} renderTag={self.renderTag} /></div>
          <div className="col-md-2"><button className="btn btn-outline-secondary btn-sm" data-target={filter.id} onClick={(e) => {
            var id = parseInt($(e.target).attr('data-target'));
            var fs = self.state.filters.slice(0);
            var sf = null;
            fs.forEach(function(f) {
              if (f.id === id) {
                sf = f;
                return;
              }
            });

            if (sf === null) {
              return;
            }

            var index = fs.indexOf(sf);
            if (index === -1) {
              return;
            }

            fs.splice(index, 1);
            self.setState({
              filters: fs
            });
          }}><i className="fa fa-close" data-target={filter.id}></i></button>
           { filter.isCorrect === false && (<span>
             <i className="fa fa-exclamation-triangle validation-error" id={"validationError_"+filter.id}></i>
             <Tooltip placement="right" target={"validationError_"+filter.id} isOpen={self.state.tooltip["validationError_"+filter.id]} toggle={() => {
                 self.toggleTooltip("validationError_"+filter.id);
             }}>
              A filter with the same name has already been specified
             </Tooltip>
           </span>) }
           { filter.isNotComplete && (<span>
            <i className="fa fa-exclamation" id={"warningError"+filter.id}></i>
            <Tooltip placement="right" target={"warningError"+filter.id} isOpen={self.state.tooltip["warningError"+filter.id]} toggle={() => {
                self.toggleTooltip("warningError"+filter.id);
            }}>
             At least one tag must be specified and the name must be filled-in
            </Tooltip>
           </span>) }
          </div>
        </div>);
      });
    }

    return (<div className="col-md-12 row">
      <div className="col-md-12"><button className="btn btn-success" onClick={this.addFilterLine}><i className="fa fa-plus"></i> Add filter</button></div>
      {filters}
    </div>);
  }
  componentWillMount() {
  }
}

export default ShopProductFilter;
