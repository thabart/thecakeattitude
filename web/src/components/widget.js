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
import { translate } from 'react-i18next';
import $ from "jquery";
import "../styles/widget.css";
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
        const { t } = this.props;
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
                <Modal isOpen={this.state.isCloseOpened} size="lg">
                    <ModalHeader toggle={this.toggleClose}><h2>{t('closeWidgetModalTitle')}</h2></ModalHeader>
                    <ModalFooter>
                        <Button color='default' onClick={this.close}>{t('yes')}</Button>
                        <Button color='default' onClick={this.toggleClose}>{t('no')}</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default translate('common', { wait: process && !process.release })(Widget);
