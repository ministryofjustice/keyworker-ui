import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactRouterPropTypes from 'react-router-prop-types'
import { Link } from 'react-router-dom'
import { properCaseName } from '../../stringUtils'
import { getStatusDescription } from '../keyworkerStatus'
import Status from './Status'
import { keyworkerListType } from '../../types'

class KeyworkerSearchResults extends Component {
  buildTableForRender() {
    const { keyworkerList } = this.props

    if (!(keyworkerList && keyworkerList.map)) {
      return []
    }

    return keyworkerList.map(a => {
      const formattedName = `${properCaseName(a.lastName)}, ${properCaseName(a.firstName)}`
      const keyworkerHref = `/manage-key-workers/key-worker/${a.staffId}`
      return (
        <tr key={a.staffId}>
          <td className="row-gutters">
            <Link
              id={`key_worker_${a.staffId}_link`}
              title="Key worker profile link"
              className="link"
              to={keyworkerHref}
            >
              {formattedName}
            </Link>
          </td>
          <td className="row-gutters">{getStatusDescription(a.status)}</td>
          <td className="row-gutters">{a.numberAllocated}</td>
          <td className="row-gutters">{a.capacity}</td>
          <td className="row-gutters">{a.autoAllocationAllowed ? 'Yes' : 'No'}</td>
          <td className="row-gutters">{a.numKeyWorkerSessions}</td>
        </tr>
      )
    })
  }

  render() {
    const {
      statusFilter,
      handleStatusFilterChange,
      searchText,
      handleSearchTextChange,
      history,
      handleSearch,
    } = this.props
    const keyworkers = this.buildTableForRender()

    return (
      <div>
        <div className="pure-g padding-bottom-large">
          <div className="pure-u-md-12-12 ">
            <div>
              <div className="pure-u-md-11-12 searchForm padding-top padding-bottom-large padding-left-30">
                <div className="pure-u-md-4-12">
                  <label className="form-label" htmlFor="search-text">
                    Key worker name
                  </label>
                  <input
                    type="text"
                    className="full-width form-control"
                    id="search-text"
                    name="searchText"
                    value={searchText}
                    onChange={handleSearchTextChange}
                  />
                </div>
                <div className="pure-u-md-3-12 margin-left">
                  <label className="form-label" htmlFor="status-select">
                    Status
                  </label>
                  <Status filter statusValue={statusFilter} handleStatusChange={handleStatusFilterChange} />
                </div>
                <button
                  type="button"
                  className="button margin-left margin-top-large"
                  onClick={() => {
                    handleSearch(history)
                  }}
                >
                  Search again
                </button>
              </div>
            </div>
          </div>
          <div>
            <div className="lede padding-top-large padding-bottom-small bold">{keyworkers.length} results:</div>
            <div className="pure-u-md-11-12">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>No. allocated prisoners</th>
                    <th>Capacity</th>
                    <th>Auto allocation</th>
                    <th>
                      No. KW sessions
                      <br />
                      in last month
                    </th>
                  </tr>
                </thead>
                <tbody>{keyworkers}</tbody>
              </table>
              {keyworkers.length === 0 && (
                <div className="font-small padding-top-large padding-bottom padding-left">No key worker found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

KeyworkerSearchResults.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  keyworkerList: keyworkerListType.isRequired,
  searchText: PropTypes.string.isRequired,
  statusFilter: PropTypes.string.isRequired,
  handleSearchTextChange: PropTypes.func.isRequired,
  handleStatusFilterChange: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  keyworkerSettings: PropTypes.shape({}).isRequired,
}

export default KeyworkerSearchResults
