import React from 'react'
import { shallow } from 'enzyme'
import HomePage from './keyworkerHomePage'

const initialConfig = {
  keyworkerProfileStatsEnabled: 'false',
  keyworkerDashboardStatsEnabled: false,
  notmEndpointUrl: '/notm/endpoint',
  prisonStaffHubUrl: '/prisonStaffHubUrl',
  mailTo: 'email@test.com',
}

describe('HomePage component', () => {
  it('should render links correctly', async () => {
    const user = {
      writeAccess: true,
      activeCaseLoadId: '',
      caseLoadOptions: [],
      expiredFlag: false,
      firstName: 'Test',
      lastName: 'User',
      lockedFlag: false,
      maintainAccess: false,
      maintainAccessAdmin: false,
      migration: false,
      staffId: 1,
      username: 'TestUser',
    }
    const component = shallow(
      <HomePage
        message="Hello!"
        config={initialConfig}
        clearMessage={jest.fn()}
        user={user}
        allowAuto
        migrated={false}
        dispatchLoaded={jest.fn()}
      />
    )
    expect(component.find('#auto_allocate_link').length).toBe(1)
    expect(component.find('#keyworker_profile_link').length).toBe(1)
    expect(component.find('#assign_transfer_link').length).toBe(1)
  })
  it('should hide the auto allocate link when user does not have write access', () => {
    const user = {
      writeAccess: false,
      activeCaseLoadId: '',
      caseLoadOptions: [],
      expiredFlag: false,
      firstName: 'Test',
      lastName: 'User',
      lockedFlag: false,
      maintainAccess: false,
      maintainAccessAdmin: false,
      migration: false,
      staffId: 1,
      username: 'TestUser',
    }
    const component = shallow(
      <HomePage
        message="Hello!"
        clearMessage={jest.fn()}
        config={initialConfig}
        user={user}
        allowAuto={false}
        migrated={false}
        dispatchLoaded={jest.fn()}
      />
    )
    expect(component.find('#auto_allocate_link').length).toBe(0)
  })
  it('should show the auto allocate link when allow autoallocate (keyworker settings) is true and user has writeAccess', () => {
    const user = {
      writeAccess: true,
      activeCaseLoadId: '',
      caseLoadOptions: [],
      expiredFlag: false,
      firstName: 'Test',
      lastName: 'User',
      lockedFlag: false,
      maintainAccess: false,
      maintainAccessAdmin: false,
      migration: false,
      staffId: 1,
      username: 'TestUser',
    }
    const component = shallow(
      <HomePage
        message="Hello!"
        clearMessage={jest.fn()}
        user={user}
        allowAuto
        config={initialConfig}
        migrated={false}
        dispatchLoaded={jest.fn()}
      />
    )
    expect(component.find('#auto_allocate_link').length).toBe(1)
  })
  it('should hide the auto allocate link when allow autoallocate (keyworker settings) is false and user has writeAccess', () => {
    const user = {
      writeAccess: true,
      activeCaseLoadId: '',
      caseLoadOptions: [],
      expiredFlag: false,
      firstName: 'Test',
      lastName: 'User',
      lockedFlag: false,
      maintainAccess: false,
      maintainAccessAdmin: false,
      migration: false,
      staffId: 1,
      username: 'TestUser',
    }
    const component = shallow(
      <HomePage
        message="Hello!"
        clearMessage={jest.fn()}
        user={user}
        allowAuto={false}
        config={initialConfig}
        migrated={false}
        dispatchLoaded={jest.fn()}
      />
    )
    expect(component.find('#auto_allocate_link').length).toBe(0)
  })
  it('should show the keyworker dashboard link when feature toggle on (and prison is migrated)', () => {
    const user = {
      writeAccess: true,
      maintainAccessAdmin: true,
      activeCaseLoadId: '',
      caseLoadOptions: [],
      expiredFlag: false,
      firstName: 'Test',
      lastName: 'User',
      lockedFlag: false,
      maintainAccess: false,
      migration: false,
      staffId: 1,
      username: 'TestUser',
    }
    const updatedConfig = {
      ...initialConfig,
      keyworkerDashboardStatsEnabled: true,
    }
    const component = shallow(
      <HomePage
        message="Hello!"
        clearMessage={jest.fn()}
        user={user}
        allowAuto={false}
        migrated
        config={updatedConfig}
        dispatchLoaded={jest.fn()}
      />
    )
    expect(component.find('#keyworker_dashboard_link').length).toBe(1)
  })

  it('should hide the keyworker dashboard link when feature toggle on and prison is NOT migrated', () => {
    const user = {
      writeAccess: true,
      maintainAccessAdmin: true,
      activeCaseLoadId: '',
      caseLoadOptions: [],
      expiredFlag: false,
      firstName: 'Test',
      lastName: 'User',
      lockedFlag: false,
      maintainAccess: false,
      migration: false,
      staffId: 1,
      username: 'TestUser',
    }
    const updatedConfig = {
      ...initialConfig,
      keyworkerDashboardStatsEnabled: true,
    }
    const component = shallow(
      <HomePage
        message="Hello!"
        clearMessage={jest.fn()}
        user={user}
        allowAuto={false}
        migrated={false}
        config={updatedConfig}
        dispatchLoaded={jest.fn()}
      />
    )
    expect(component.find('#keyworker_dashboard_link').length).toBe(0)
  })
})
