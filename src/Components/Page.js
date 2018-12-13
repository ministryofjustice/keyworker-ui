import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Header from '@govuk-react/header'
import Error from '../Error'
import Spinner from '../Spinner'
import { Container } from './Page.styles'
import { childrenType } from '../types'
import Breadcrumb from './Breadcrumb'

const Page = ({ error, loaded, title, children, alwaysRender }) => {
  if (loaded || error) {
    return (
      <Fragment>
        <Breadcrumb />
        <Container>
          <Header level={1} size="LARGE">
            {title}
          </Header>
          {error && <Error error={error} />}
          {(!error || alwaysRender) && <div>{children}</div>}
        </Container>
      </Fragment>
    )
  }

  return <Spinner />
}

Page.propTypes = {
  error: PropTypes.string.isRequired,
  loaded: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  children: childrenType.isRequired,
  alwaysRender: PropTypes.bool,
}

Page.defaultProps = {
  alwaysRender: false,
}

const mapStateToProps = state => ({
  error: state.app.error,
  loaded: state.app.loaded,
})

export default connect(mapStateToProps)(Page)
