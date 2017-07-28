import React, {Component} from "react";
import {Form, FormGroup, Col, Label, Input, FormFeedback, Button} from "reactstrap";
import {UserService} from "../services/index";
import { translate } from 'react-i18next';

class ContactInfoForm extends Component {
    constructor(props) {
        super(props);
        this.previous = this.previous.bind(this);
        this.next = this.next.bind(this);
        this.toggle = this.toggle.bind(this);
        this.update = this.update.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = {
            isEnabled: false,
            isContactInfoHidden: false,
            userInfo: null,
            isUpdating: false,
            isEmailInvalid: false,
            isMobilePhoneInvalid: false,
            isHomePhoneInvalid: false
        };
    }

    handleInputChange(e) { // This method is called when a change occures in a field.
        var self = this;
        const target = e.target;
        const name = target.name;
        var isEmailInvalid = false,
            isMobilePhoneInvalid = false,
            isHomePhoneInvalid = false;
        switch (name) {
            case "email":
                var regex = new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$");
                if (!regex.test(target.value)) {
                    isEmailInvalid = true;
                }
                break;
            case "mobile_phone_number":
            case "home_phone_number":
                var regex = new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
                if (!regex.test(target.value)) {
                    if (name == "mobile_phone_number") {
                        isMobilePhoneInvalid = true;
                    } else {
                        isHomePhoneInvalid = true;
                    }
                }
                break;
        }

        self.setState({
            isEmailInvalid: isEmailInvalid,
            isMobilePhoneInvalid: isMobilePhoneInvalid,
            isHomePhoneInvalid: isHomePhoneInvalid
        });

        this.state.userInfo[name] = target.value;
        this.setState({
            userInfo: this.state.userInfo
        });
    }

    previous() { // This method is called when the user clicks on the "previous" button.
        this.props.onPrevious();
    }

    next() { // This method is called when the user clicks on the "next" button.
        this.props.onNext();
    }

    toggle(e) { // Enable / disable the form.
        this.setState({
            isEnabled: e.target.checked
        });
    }

    update() { // Update the profile information.
        const {t} = this.props;
        var json = {
            home_phone_number: this.state.userInfo.home_phone_number,
            mobile_phone_number: this.state.userInfo.mobile_phone_number,
            email: this.state.userInfo.email
        };
        var self = this;
        self.setState({
            isUpdating: true
        });
        UserService.updateClaims(json).then(function () {
            self.setState({
                isUpdating: false
            });
            self.props.onSuccess(t('profileUpdated'));
        }).catch(function () {
            self.props.onError(t('uploadProfileError'));
            self.setState({
                isUpdating: false
            });
        });
    }

    componentWillMount() { // Initialize the view.
        var self = this;
        const {t} = this.props;
        this.setState({
            isContactInfoHidden: true
        });
        UserService.getClaims().then(function (userInfo) {
            self.setState({
                isContactInfoHidden: false,
                userInfo: userInfo
            });
        }).catch(function () {
            self.props.onError(t('retrieveProfileInfoError'));
            self.setState({
                isContactInfoHidden: false
            });
        });
    }

    render() {
        const {t} = this.props;
        if (this.state.isContactInfoHidden) {
            return (<section className="col-md-12 section">{t('loadingMessage')}</section>)
        }

        var opts = {};
        if (!this.state.isEnabled) {
            opts['readOnly'] = 'readOnly';
        }

        var isInvalid = this.state.isEmailInvalid || this.state.isMobilePhoneInvalid || this.state.isHomePhoneInvalid;
        var updateBtnParams = {};
        var nextBtnParams = {};
        if (isInvalid) {
            nextBtnParams['disabled'] = 'disabled';
        }

        if (isInvalid || !this.state.isEnabled) {
          updateBtnParams['disabled'] = 'disabled';
        }

        /** Errors **/
        const emailError = this.state.isEmailInvalid ? t('invalidEmailError') : null;
        const mobilePhoneError = this.state.isMobilePhoneInvalid ? t('invalidMobilePhoneError') : null;
        const homePhoneError = this.state.isHomePhoneInvalid ? t('invalidHomePhoneError') : null;
        const feedbackEmail = emailError ? "danger" : undefined;
        const feedbackMobilePhone = mobilePhoneError ? "danger" : undefined;
        const feedbackHomePhone = homePhoneError ? "danger" : undefined;

        return (
            <div className="container rounded">
                <section className="row p-1">
                    <div className="col-md-12">
                        <Form>
                            <FormGroup>
                                <p>
                                    <i className="fa fa-exclamation-triangle txt-info"/>
                                    {t('contactInfoAddShopFormDescription')}
                                </p>
                                <p>{t('updateInfoQuestion')}{' '}
                                    <Label check>
                                        <Input type="checkbox" onClick={this.toggle}/>{' '}
                                        {t("yesOrNo")}
                                    </Label>
                                </p>
                            </FormGroup>
                            <FormGroup color={feedbackEmail}>
                                <Label sm={12}>{t('Email')}</Label>
                                <Col sm={12}>
                                    <Input state={feedbackEmail}
                                           type="email"
                                           className={!this.state.isEmailInvalid ? 'form-control' : 'form-control invalid'}
                                           value={this.state.userInfo.email} onChange={this.handleInputChange}
                                           name='email' {...opts}/>
                                    {emailError && (<FormFeedback>{emailError}</FormFeedback>)}
                                </Col>
                            </FormGroup>
                            <FormGroup color={feedbackMobilePhone}>
                                <Label sm={12}>{t('mobilePhone')}</Label>
                                <Col sm={12}>
                                    <Input state={feedbackMobilePhone}
                                           type="text"
                                           className={!this.state.isMobilePhoneInvalid ? 'form-control' : 'form-control invalid'}
                                           value={this.state.userInfo.mobile_phone_number}
                                           onChange={this.handleInputChange}
                                           name='mobile_phone_number' {...opts} />
                                    {mobilePhoneError && (<FormFeedback>{mobilePhoneError}</FormFeedback>)}
                                </Col>
                            </FormGroup>
                            <FormGroup color={feedbackHomePhone}>
                                <Label sm={12}>{t('homePhone')}</Label>
                                <Col sm={12}>
                                    <Input state={feedbackHomePhone}
                                           type="text"
                                           className={!this.state.isHomePhoneInvalid ? 'form-control' : 'form-control invalid'}
                                           value={this.state.userInfo.home_phone_number}
                                           onChange={this.handleInputChange}
                                           name='home_phone_number' {...opts} />
                                    {this.state.isHomePhoneInvalid && (<FormFeedback>{homePhoneError}</FormFeedback>)}
                                </Col>
                            </FormGroup>
                        </Form>
                    </div>
                </section>
                <section className="row p-1">
                    <Button color="default" onClick={this.previous}>{t('previous')}</Button>
                    {!this.state.isUpdating ?
                        (<Button color="default" style={{marginLeft: "5px"}} onClick={this.update} {...updateBtnParams}>{t('update')}</Button>) :
                        (<Button color="default" style={{marginLeft: "5px"}} disabled>
                                <i className='fa fa-spinner fa-spin'/>
                                {t('processingUpdate')}
                            </Button>
                        )
                    }
                    {!this.state.isUpdating ?
                        (<Button color="default" style={{marginLeft: "5px"}} onClick={this.next} {...nextBtnParams}>{t('next')}</Button>) :
                        (<Button color="default" style={{marginLeft: "5px"}} disabled>t('next')</Button>)
                    }
                </section>
            </div>
        );
    }
}

export default translate('common', { wait: process && !process.release, withRef: true })(ContactInfoForm);
