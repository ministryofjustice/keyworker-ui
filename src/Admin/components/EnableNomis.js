import React from 'react'
import PropTypes from 'prop-types'
import ReactRouterPropTypes from 'react-router-prop-types'
import { userType } from '../../types'

const EnableNomis = ({ user, history, handleEnable, handleCancel }) => {
  const caseLoadOption = user.caseLoadOptions
    ? user.caseLoadOptions.find(option => option.caseLoadId === user.activeCaseLoadId)
    : undefined
  const caseLoadDesc = caseLoadOption ? caseLoadOption.description : user.activeCaseLoadId
  return (
    <div>
      <div className="pure-g">
        <div className="pure-u-md-12-12 padding-top">
          <div className="pure-u-md-2-12">
            <div className="bold">Prison</div>
          </div>
          <div className="pure-u-md-4-12">
            <div>{caseLoadDesc}</div>
          </div>
          <hr />
        </div>
        <div className="pure-u-md-12-12 padding-top">
          <div className="pure-u-md-4-12 padding-top bold">
            Select Yes to give a prison access to New NOMIS for the first time, or to add new prison staff to this
            prison&apos;s account.
          </div>
        </div>
        <div className="pure-u-md-5-12 padding-top-large margin-top">
          <div className="buttonGroup">
            <button
              type="button"
              id="giveAccessButton"
              className="button button-save"
              onClick={() => handleEnable(history)}
            >
              Yes, give access now
            </button>
          </div>
          <div className="buttonGroup">
            <button type="button" className="button greyButton button-cancel" onClick={() => handleCancel(history)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

EnableNomis.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  handleEnable: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  user: userType.isRequired,
}

export default EnableNomis
