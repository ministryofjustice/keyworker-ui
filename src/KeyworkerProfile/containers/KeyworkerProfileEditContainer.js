import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactRouterPropTypes from 'react-router-prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import axios from 'axios'
import {
  setKeyworker,
  setKeyworkerCapacity,
  setKeyworkerStatus,
  resetValidationErrors,
  setMessage,
  setValidationError,
} from '../../redux/actions'
import KeyworkerProfileEdit from '../components/KeyworkerProfileEdit'
import Page from '../../Components/Page'
import { stringIsInteger } from '../../stringUtils'
import { userType, keyworkerType } from '../../types'

class KeyworkerProfileEditContainer extends Component {
  componentDidMount() {
    const { user, history, match, keyworker } = this.props
    if (!user || !user.writeAccess) {
      history.push('/')
      return
    }
    // invalid deeplink
    if (!keyworker.staffId) {
      history.push(`/key-worker/${match.params.staffId}`)
    }
  }

  handleSaveChanges = async (history) => {
    if (!this.validate()) {
      return
    }

    const { status, keyworker, setMessageDispatch, handleError } = this.props
    const statusChange = status !== keyworker.status

    try {
      if (this.formChange()) {
        if (statusChange && status !== 'ACTIVE') {
          history.replace(`/key-worker/${keyworker.staffId}/confirm-edit`)
        } else {
          await this.postKeyworkerUpdate()
          setMessageDispatch('Profile changed')
          // Return to profile page
          history.goBack()
        }
      } else {
        history.goBack()
      }
    } catch (error) {
      handleError(error)
    }
  }

  formChange = () => {
    const { capacity, keyworker, status } = this.props
    const capacityChange = capacity !== keyworker.capacity.toString()
    const statusChange = status !== keyworker.status

    return capacityChange || statusChange
  }

  postKeyworkerUpdate = async () => {
    const {
      agencyId,
      keyworker: { staffId },
      status,
      capacity,
    } = this.props

    await axios.post(
      '/api/keyworkerUpdate',
      {
        keyworker: {
          status,
          capacity,
        },
      },
      {
        params: {
          agencyId,
          staffId,
        },
      }
    )
  }

  handleCancel = (history) => {
    // Return to profile page
    history.goBack()
  }

  handleStatusChange = (event) => {
    const { keyworkerStatusDispatch } = this.props

    keyworkerStatusDispatch(event.target.value)
  }

  handleCapacityChange = (event) => {
    const { keyworkerCapacityDispatch } = this.props

    keyworkerCapacityDispatch(event.target.value)
  }

  validate = () => {
    const { capacity, setValidationErrorDispatch, resetValidationErrorsDispatch } = this.props

    if (!stringIsInteger(capacity)) {
      setValidationErrorDispatch('capacity', 'Please enter a number')
      return false
    }
    resetValidationErrorsDispatch()
    return true
  }

  render() {
    return (
      <Page title="Edit profile">
        <KeyworkerProfileEdit
          handleSaveChanges={this.handleSaveChanges}
          handleCancel={this.handleCancel}
          handleStatusChange={this.handleStatusChange}
          handleCapacityChange={this.handleCapacityChange}
          {...this.props}
        />
      </Page>
    )
  }
}

KeyworkerProfileEditContainer.propTypes = {
  error: PropTypes.string.isRequired,
  agencyId: PropTypes.string.isRequired,
  keyworkerDispatch: PropTypes.func.isRequired,
  keyworker: keyworkerType.isRequired,
  setMessageDispatch: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
  keyworkerStatusDispatch: PropTypes.func.isRequired,
  keyworkerCapacityDispatch: PropTypes.func.isRequired,
  match: PropTypes.shape({ params: PropTypes.shape({ staffId: PropTypes.number }) }).isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  status: PropTypes.string.isRequired,
  capacity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  validationErrors: PropTypes.shape({}).isRequired,
  setValidationErrorDispatch: PropTypes.func.isRequired,
  resetValidationErrorsDispatch: PropTypes.func.isRequired,
  user: userType.isRequired,
}

const mapStateToProps = (state) => ({
  error: state.app.error,
  user: state.app.user,
  agencyId: state.app.user.activeCaseLoadId,
  keyworker: state.keyworkerSearch.keyworker,
  capacity: state.keyworkerSearch.capacity,
  status: state.keyworkerSearch.status,
  validationErrors: state.app.validationErrors,
  setValidationErrorDispatch: PropTypes.func,
  resetValidationErrorsDispatch: PropTypes.func,
})

const mapDispatchToProps = (dispatch) => ({
  keyworkerDispatch: (object) => dispatch(setKeyworker(object)),
  keyworkerStatusDispatch: (status) => dispatch(setKeyworkerStatus(status)),
  keyworkerCapacityDispatch: (capacity) => dispatch(setKeyworkerCapacity(capacity)),
  setMessageDispatch: (message) => dispatch(setMessage(message)),
  setValidationErrorDispatch: (fieldName, message) => dispatch(setValidationError(fieldName, message)),
  resetValidationErrorsDispatch: () => dispatch(resetValidationErrors()),
})

export { KeyworkerProfileEditContainer }
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(KeyworkerProfileEditContainer))
