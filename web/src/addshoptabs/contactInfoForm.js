import React, {Component} from "react";
import {Form, FormGroup, Col, Label, Input, FormFeedback, Button} from "reactstrap";
import {UserService} from "../services/index";

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

    handleInputChange(e) {
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

    previous() {
        this.props.onPrevious();
    }

    next() {
        this.props.onNext();
    }

    toggle(e) {
        this.setState({
            isEnabled: e.target.checked
        });
    }

    update() {
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
        }).catch(function () {
            self.props.onError('an error occured while trying to update the profile');
            self.setState({
                isUpdating: false
            });
        });
    }

    componentWillMount() {
        var self = this;
        this.setState({
            isContactInfoHidden: true
        });
        UserService.getClaims().then(function (userInfo) {
            self.setState({
                isContactInfoHidden: false,
                userInfo: userInfo
            });
        }).catch(function () {
            self.props.onError('user information cannot be retrieved');
            self.setState({
                isContactInfoHidden: false
            });
        });
    }

    render() {
        if (this.state.isContactInfoHidden) {
            return (<section className="col-md-12 section">Loading ...</section>)
        }

        var opts = {};
        if (!this.state.isEnabled) {
            opts['readOnly'] = 'readOnly';
        }

        var isInvalid = this.state.isEmailInvalid || this.state.isMobilePhoneInvalid || this.state.isHomePhoneInvalid;
        var optsActions = {};
        if (isInvalid) {
            optsActions['disabled'] = 'disabled';
        }

        /** Errors **/
        const emailError = this.state.isEmailInvalid ? "The email is not valid" : null;
        const mobilePhoneError = this.state.isMobilePhoneInvalid ? "The mobile phone is not valid" : null;
        const homePhoneError = this.state.isHomePhoneInvalid ? "The home phone is not valid" : null;
        const feedbackEmail = emailError ? "warning" : undefined;
        const feedbackMobilePhone = mobilePhoneError ? "warning" : undefined;
        const feedbackHomePhone = homePhoneError ? "warning" : undefined;

        return (
            <div className="container bg-white rounded">
                <section className="row p-1">
                    <div className="col-md-12">
                        <Form>
                            <FormGroup>
                                <p>
                                    <i className="fa fa-exclamation-triangle text-info"/>
                                    Those information are coming from your profile.
                                </p>
                                <p>Do-you want to update them ?{' '}
                                    <Label check>
                                        <Input type="checkbox" onClick={this.toggle}/>{' '}
                                        Yes or No
                                    </Label>
                                </p>
                            </FormGroup>
                            <FormGroup color={feedbackEmail}>
                                <Label sm={12}>Email</Label>
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
                                <Label sm={12}>Mobile phone</Label>
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
                                <Label sm={12}>Home phone</Label>
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

                    <Button outline color="info" onClick={this.previous}>Previous</Button>
                    {!this.state.isUpdating ?
                        (<Button outline color="info" onClick={this.update} {...optsActions}>Update</Button>) :
                        (<Button outline color="info" disabled>
                                <i className='fa fa-spinner fa-spin'/>
                                Processing update ...
                            </Button>
                        )
                    }
                    {!this.state.isUpdating ?
                        (<Button outline color="info" onClick={this.next} {...optsActions}>Next</Button>) :
                        (<Button outline color="info" disabled>Next</Button>)
                    }
                </section>
            </div>
        );
    }
}

export default ContactInfoForm;
