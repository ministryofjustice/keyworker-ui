import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import axios from "axios";
import moment from 'moment';
import { setKeyworker, setKeyworkerStatusChangeBehaviour } from '../../redux/actions/index';
import KeyworkerProfileEditConfirm from '../components/KeyworkerProfileEditConfirm';
import Error from '../../Error';
import { resetValidationErrors, setMessage, setValidationError, setAnnualLeaveReturnDate } from "../../redux/actions";
import * as behaviours from '../keyworkerStatusBehavour';
import { switchToIsoDateFormat, isBlank } from '../../stringUtils';

class KeyworkerProfileEditConfirmContainer extends Component {
  constructor () {
    super();
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
  }

  componentDidMount () {
    const { status, history, match, setStatusChangeBehaviourDispatch, dateDispatch } = this.props;

    if (!status || status === '') {
      history.push(`/keyworker/${match.params.staffId}/profile`);
    }
    if (status === 'INACTIVE') {
      setStatusChangeBehaviourDispatch('REMOVE_ALLOCATIONS_NO_AUTO');
    } else {
      setStatusChangeBehaviourDispatch('');
    }
    dateDispatch('');
  }

  async handleSaveChanges (history) {
    const { behaviour, keyworker, setMessageDispatch, handleError } = this.props;

    if (!this.validate()) return;

    try {
      await this.postKeyworkerUpdate();
      if (behaviour === behaviours.REMOVE_ALLOCATIONS_NO_AUTO) {
        if (keyworker.numberAllocated > 0) {
          setMessageDispatch("Prisoners removed from key worker");
        } else {
          setMessageDispatch("Profile changed");
        }
      } else {
        setMessageDispatch("Profile changed");
      }
      // On success, return to KW profile by 'popping' history
      history.goBack();
    } catch (error) {
      handleError(error);
    }
  }

  validate () {
    const { behaviour, status, annualLeaveReturnDate, resetValidationErrorsDispatch, setValidationErrorDispatch } = this.props;

    resetValidationErrorsDispatch();
    let result = true;
    if (!behaviour) {
      setValidationErrorDispatch("behaviourRadios", "Please choose an option");
      result = false;
    }
    if (status === 'UNAVAILABLE_ANNUAL_LEAVE' && isBlank(annualLeaveReturnDate)) {
      setValidationErrorDispatch("active-date", "Please choose a return date");
      result = false;
    }
    return result;
  }

  async postKeyworkerUpdate () {
    const { agencyId, keyworker, status, capacity, behaviour, annualLeaveReturnDate } = this.props;

    await axios.post('/api/keyworkerUpdate',
      {
        keyworker:
            {
              status,
              capacity,
              behaviour,
              activeDate: switchToIsoDateFormat(annualLeaveReturnDate)
            }
      },
      {
        params:
            {
              agencyId,
              staffId: keyworker.staffId
            }
      });
  }

  handleCancel (history) {
    const { keyworker } = this.props;

    // Use replace to ensure the profile page remains the history 'parent'
    history.replace(`/keyworker/${keyworker.staffId}/profile/edit`);
  }

  handleOptionChange (event) {
    const { setStatusChangeBehaviourDispatch } = this.props;

    setStatusChangeBehaviourDispatch(event.target.value);
  }

  handleDateChange (date) {
    const { dateDispatch } = this.props;
    
    if (date) {
      dateDispatch(moment(date).format('DD/MM/YYYY'));
    }
  }

  render () {
    const { error } = this.props;

    if (error) return <Error {...this.props} />;

    return <KeyworkerProfileEditConfirm handleSaveChanges={this.handleSaveChanges} handleDateChange={this.handleDateChange} handleCancel={this.handleCancel} handleOptionChange={this.handleOptionChange} {...this.props} />;
  }
}

KeyworkerProfileEditConfirmContainer.propTypes = {
  error: PropTypes.string,
  status: PropTypes.string,
  capacity: PropTypes.string,
  behaviour: PropTypes.string,
  annualLeaveReturnDate: PropTypes.string,
  agencyId: PropTypes.string.isRequired,
  keyworkerDispatch: PropTypes.func,
  keyworker: PropTypes.object,
  setMessageDispatch: PropTypes.func,
  dateDispatch: PropTypes.func,
  handleError: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  setStatusChangeBehaviourDispatch: PropTypes.func,
  history: PropTypes.object.isRequired,
  setValidationErrorDispatch: PropTypes.func,
  resetValidationErrorsDispatch: PropTypes.func,
  validationErrors: PropTypes.object
};

const mapStateToProps = state => {
  return {
    agencyId: state.app.user.activeCaseLoadId,
    keyworker: state.keyworkerSearch.keyworker,
    status: state.keyworkerSearch.status,
    capacity: state.keyworkerSearch.capacity,
    behaviour: state.keyworkerSearch.statusChangeBehaviour,
    validationErrors: state.app.validationErrors,
    annualLeaveReturnDate: state.keyworkerSearch.annualLeaveReturnDate
  };
};

const mapDispatchToProps = dispatch => {
  return {
    keyworkerDispatch: object => dispatch(setKeyworker(object)),
    setMessageDispatch: (message) => dispatch(setMessage(message)),
    setStatusChangeBehaviourDispatch: (message) => dispatch(setKeyworkerStatusChangeBehaviour(message)),
    setValidationErrorDispatch: (fieldName, message) => dispatch(setValidationError(fieldName, message)),
    resetValidationErrorsDispatch: message => dispatch(resetValidationErrors()),
    dateDispatch: text => dispatch(setAnnualLeaveReturnDate(text))
  };
};

export { KeyworkerProfileEditConfirmContainer };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(KeyworkerProfileEditConfirmContainer));

