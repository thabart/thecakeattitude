import React, { Component } from 'react';
import { Tooltip } from "reactstrap";
import { Guid } from '../utils';
import { translate } from 'react-i18next';
import TagsInput from "react-tagsinput";
import $ from 'jquery';

class ShopProductFilter extends Component {
  constructor(props) {
    super(props);
    this._indexFilter = 0;
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.addFilterLine = this.addFilterLine.bind(this);
    this.renderTag = this.renderTag.bind(this);
    this.state = {
      tooltip:  {},
      filters: []
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
      isNotComplete: true,
      isCorrect: false
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
    return this.state.filters
      .filter(function(f) { return !f.isNotComplete && f.isCorrect; })
      .map(function(f) { return { id: f.externalId, name: f.name, values: f.tags }; });
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
    const {t} = this.props;
    if (this.state.filters && this.state.filters.length > 0) {
      this.state.filters.forEach(function(filter) {
        filters.push(<div className="row col-md-12">
          <div className="col-md-4"><input type="text" className="form-control" value={filter.name} placeholder={t('filterName')} onChange={(e) => {
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

            if (self.props.onChange) {
              self.props.onChange(self.getFilters());
            }
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

            if (self.props.onChange) {
              self.props.onChange(self.getFilters());
            }
          }}   inputProps={{placeholder: t('filterValues')}} renderTag={self.renderTag} /></div>
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
            self.state.filters = fs;
            self.setState({
              filters: fs
            });

            if (self.props.onChange) {
              self.props.onChange(self.getFilters());
            }
          }}><i className="fa fa-close" data-target={filter.id}></i></button>
           { filter.isCorrect === false && (<span>
             <i className="fa fa-exclamation-triangle txt-info" id={"validationError_"+filter.id}></i>
             <Tooltip className="red-tooltip-inner" placement="right" target={"validationError_"+filter.id} isOpen={self.state.tooltip["validationError_"+filter.id]} toggle={() => {
                 self.toggleTooltip("validationError_"+filter.id);
             }}>
              {t('filterSameNameError')}
             </Tooltip>
           </span>) }
           { filter.isNotComplete && (<span>
            <i className="fa fa-exclamation-triangle txt-info" id={"warningError"+filter.id}></i>
            <Tooltip className="red-tooltip-inner" placement="right" target={"warningError"+filter.id} isOpen={self.state.tooltip["warningError"+filter.id]} toggle={() => {
                self.toggleTooltip("warningError"+filter.id);
            }}>
             {t('filterRowInfoTooltip')}
            </Tooltip>
           </span>) }
          </div>
        </div>);
      });
    }

    return (<div className="col-md-12 row">
      <div className="col-md-12"><button className="btn btn-default" onClick={this.addFilterLine}><i className="fa fa-plus"></i> {t('addFilter')}</button></div>
      {filters}
    </div>);
  }

  componentWillMount() {
    if (this.props.filters) {
      var filters = this.props.filters;
      filters.forEach(function(filter) { filter.isCorrect = true; filter.isNotComplete = false; });
      this.setState({
        filters: filters
      });
    }
  }
}

export default translate('common', { wait: process && !process.release, withRef: true })(ShopProductFilter);
