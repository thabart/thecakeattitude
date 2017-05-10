import React, {Component} from "react";
import {withRouter} from "react-router";
import {Calendar, List} from "./shopService";
import "./services.css";

class ShopServices extends Component {
    constructor(props) {
        super(props);
        this.openCalendar = this.openCalendar.bind(this);
        this.openList = this.openList.bind(this);
    }

    openCalendar() {
        this.props.history.push('/shops/' + this.props.shop.id + '/services/calendar');
    }

    openList() {
        this.props.history.push('/shops/' + this.props.shop.id + '/services');
    }

    render() {
        var action = this.props.match.params.subaction,
            content = null,
            self = this;
        if (action === "calendar") {
            content = (<Calendar />);
        } else {
            content = (<List />);
            action = "list";
        }

        return (<section className="row white-section shop-section shop-section-padding">
            <div className="row col-md-12 menu-service">
                <div className="options">
                    <i className={action === 'list' ? "fa fa-list active" : "fa fa-list"} onClick={self.openList}></i>
                    <i className={action === 'calendar' ? "fa fa-calendar active" : "fa fa-calendar"}
                       onClick={self.openCalendar}></i>
                </div>
            </div>
            {content}
        </section>);
    }
}

export default withRouter(ShopServices);
