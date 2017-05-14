import React, {Component} from "react";
import {
    ButtonGroup,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Card,
    CardBlock,
    CardTitle,
    CardSubtitle,
    CardText
} from "reactstrap";
import $ from "jquery";
import "./widget.css";
import "../styles/Palette.css";
window.jQuery = $;

class Widget extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.toggleFullScreen = this.toggleFullScreen.bind(this);
        this.toggleClose = this.toggleClose.bind(this);
        this.close = this.close.bind(this);
        this.state = {
            isToggled: true,
            isCloseOpened: false
        };
    }

    toggle() {
        this.setState(prev => ({
            isToggled: !prev.isToggled
        }));
        $(this.body).toggle('collapse');
    }

    toggleFullScreen() {
        var card = this.card;

        if ($(card).hasClass('is-full-screen')) {
            $(card).css('position', 'relative').css('top', '').css('z-index', '').css('left', '').css('width', '').css('height', '');
            $(card).removeClass('is-full-screen');
            return;
        }

        $(card).css('position', 'fixed').css('z-index', 1000).animate({
            top: '6%',
            left: 0,
            width: '100%',
            height: '100%'
        }, 200, function () {
            $(card).addClass('is-full-screen');
        });
    }

    toggleClose() {
        this.setState(prev => ({
            isCloseOpened: !prev.isCloseOpened
        }));
    }

    close() {
        this.toggleClose();
        $(this.card).remove();
    }

    render() {
        return (
            <div>
                <div className="card widget-full-screen" ref={(elt) => {
                    this.card = elt;
                }}>
                    <div className="card-header d-flex justify-content-between colorAccent">
                        <h5>{this.props.title}</h5>
                        <ButtonGroup className="text-left">
                            <Button outline color="secondary" size="sm" onClick={this.toggle}>
                                <i className={this.state.isToggled ? "fa fa-arrow-up" : "fa fa-arrow-down"}/>
                            </Button>
                            <Button outline color="secondary" size="sm" onClick={this.toggleFullScreen}>
                                <i className="fa fa-expand"/>
                            </Button>
                            <Button outline color="secondary" size="sm" onClick={this.toggleClose}>
                                <i className="fa fa-window-close-o"/>
                            </Button>
                        </ButtonGroup>
                    </div>
                    <div className="collapse card-block show" ref={(elt) => {
                        this.body = elt;
                    }}>
                        {this.props.children}
                    </div>
                </div>
                <Modal isOpen={this.state.isCloseOpened}>
                    <ModalHeader toggle={this.toggleClose}>Do-you want to close the widget?</ModalHeader>
                    <ModalFooter>
                        <Button color='success' onClick={this.close}>Yes</Button>
                        <Button color='danger' onClick={this.toggleClose}>No</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default Widget;
