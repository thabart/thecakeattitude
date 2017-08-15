import React, { Component } from "react";
import { translate } from 'react-i18next';
import { MessageService, UserService } from './services/index';
import { Breadcrumb, BreadcrumbItem, Input, FormFeedback, UncontrolledTooltip, FormGroup, Label, Form } from 'reactstrap';
import { withRouter } from "react-router";
import AppDispatcher from './appDispatcher';
import MainLayout from './MainLayout';

class NewMessage extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.send = this.send.bind(this);
    this.navigateMessages = this.navigateMessages.bind(this);
    this.buildError = this.buildError.bind(this);
    this.refresh = this.refresh.bind(this);
    this.state = {
      isLoading: false,
      to: null,
      subject: null,
      content: null,
      valid: {
        isSubjectInvalid: false,
        isContentInvalid: false
      }
    };
  }

  handleInputChange(e) { // Handle the input change.
      const target = e.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      this.setState({
          [name]: value
      });
  }

  send(e) { // Send a message.
    e.preventDefault();
    var self = this,
      valid = self.state.valid,
      isValid = true;
    // Check subject.
    if (!self.state.subject || self.state.subject.length < 1 || self.state.subject.length > 50) {
        valid.isSubjectInvalid = true;
        isValid = false;
    } else {
        valid.isSubjectInvalid = false;
    }

    // Check content.
    if (!self.state.content || self.state.content.length < 1 || self.state.content.length > 255) {
        valid.isContentInvalid = true;
        isValid = false;
    } else {
        valid.isContentInvalid = false;
    }

    this.setState({
      valid: valid
    });

    if (!isValid) {
      return;
    }
  }

  navigateMessages(e) { // Navigate to my messages.
    e.preventDefault();
    this.props.history.push('/messages');
  }

  buildError(validName, description) { // Build an error.
      var result;
      if (this.state.valid[validName]) {
          result = (
              <span>
                  {description}
              </span>);
      }

      return result;
  }

  refresh() { // Refresh the page.
    var self = this;
    self.setState({
      isLoading: true
    });
  }

  render() { // Display new message form.
    const {t} = this.props;
    if (this.state.isLoading) {
        return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
            <div className="container">
              <i className='fa fa-spinner fa-spin'></i>
            </div>
        </MainLayout>);
    }

    var self = this;
    const subjectError = this.buildError('isSubjectInvalid', t('contains1To50CharsError'));
    const contentError = this.buildError('isContentInvalid', t('contains1To255CharsError'));
    const feedbackSubject = subjectError ? "danger" : undefined;
    const feedbackContent = contentError ? "danger" : undefined;
    return (
      <MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
        <div className="container">
          <h2>{t('newMessageTitle')}</h2>
          <div className="section">
            <Breadcrumb>
              <BreadcrumbItem>
                <a href="#"
                 onClick={(e) => {
                 self.navigateMessages(e);
                }}>
                  {t('yourMessages')}
                </a>
               </BreadcrumbItem>
              <BreadcrumbItem active>{t('newMessageTitle')}</BreadcrumbItem>
            </Breadcrumb>
            <Form onSubmit={this.send} style={{padding: "20px"}}>
              { /* User */ }
              <div className="form-group">
                <label>{t('userMessage')} <i className="fa fa-info-circle txt-info" id="tooltipUserMessage"/></label>
                <UncontrolledTooltip placement="right" target="tooltipUserMessage" className="red-tooltip-inner">
                    {t('userMessageTooltip')}
                </UncontrolledTooltip>
                <Input type="text" value={this.state.to} disabled />
              </div>
              { /* Subject of the message  */ }
              <FormGroup color={feedbackSubject}>
                <Label className="col-form-label">{t('subjectMessage')} <i className="fa fa-info-circle txt-info" id="tooltipSubjectMessage"/></Label>
                <UncontrolledTooltip placement="right" target="tooltipSubjectMessage" className="red-tooltip-inner">
                    {t('subjectMessageTooltip')}
                </UncontrolledTooltip>
                <Input type="text" state={feedbackSubject} name="subject" onChange={this.handleInputChange} />
                <FormFeedback>{subjectError}</FormFeedback>
              </FormGroup>
              { /* Content of the message */ }
              <FormGroup color={feedbackContent}>
                <Label className="col-form-label">{t('contentMessage')} <i className="fa fa-info-circle txt-info" id="tooltipContentMessage"/></Label>
                <UncontrolledTooltip placement="right" target="tooltipContentMessage" className="red-tooltip-inner">
                    {t('contentMessageTooltip')}
                </UncontrolledTooltip>
                <Input type="textarea" state={feedbackContent} name="content" onChange={this.handleInputChange} />
                <FormFeedback>{contentError}</FormFeedback>
              </FormGroup>
              { /* Submit button */ }
              <div className="form-group">
                <button className="btn btn-default">{t('sendMessage')}</button>
              </div>
            </Form>
          </div>
        </div>
      </MainLayout>
    );
  }

  componentDidMount() { // Execute before the render.
      var self = this,
        action = self.props.match.params.action,
        id = self.props.match.params.id;
    
  }
}

export default translate('common', { wait: process && !process.release })(withRouter(NewMessage));
