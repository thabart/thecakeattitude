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
window.jQuery = $;

class Widget extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.toggleClose = this.toggleClose.bind(this);
        this.close = this.close.bind(this);
        this.state = {
            isToggled: true,
            isCloseOpened: false,
            isMovedEnabled: true
        };
    }

    toggle() {
        this.setState(prev => ({
            isToggled: !prev.isToggled
        }));
        if (this.state.isToggled) {
          $(this.container).removeClass('card-container');
        } else {
          $(this.container).addClass('card-container');
        }

        $(this.body).toggle('collapse');
    }

    toggleClose() {
        this.setState(prev => ({
            isCloseOpened: !prev.isCloseOpened
        }));
    }

    close() {
      this.props.onClose();
      this.toggleClose();
      $(this.card).remove();
    }

    enableMove(b) {
      this.setState({
        isMovedEnabled: b
      });
    }

    render() {
        return (
            <div className="card-container"ref={(elt) => {
                this.container = elt;
            }}>
                <div className="card widget-full-screen" ref={(elt) => {
                    this.card = elt;
                }}>
                    <div className="card-header colorAccent">
                        <h5 className="first-column">{this.props.title}</h5>
                        <ButtonGroup className="last-column">
                          <Button outline color="secondary" size="sm" onClick={this.toggle}>
                            <i className={this.state.isToggled ? "fa fa-arrow-up" : "fa fa-arrow-down"}/>
                          </Button>
                          {this.state.isMovedEnabled && (
                            <Button outline color="secondary" size="sm">
                              <i className="fa fa-arrows-alt move"/>
                            </Button>
                          )}
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
