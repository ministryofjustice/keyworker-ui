import React from 'react'
import { shallow } from 'enzyme'
import { Breadcrumb } from './Breadcrumb'

const props = {
  breadcrumbs: [
    {
      key: '/',
      props: {
        match: {
          path: '/',
          url: '/',
          isExact: true,
          params: {},
        },
        location: {
          pathname: '/test-page',
          search: '',
          hash: '',
          key: '8h5b0i',
        },
        children: 'Application homepage',
      },
      type: 'span',
    },
    {
      key: '/test-page',
      props: {
        match: {
          path: '/test-page',
          url: '/test-page',
          isExact: true,
          params: {},
        },
        location: {
          pathname: '/test-page',
          search: '',
          hash: '',
          key: '8h5b0i',
        },
        children: 'Test page',
      },
      type: 'span',
    },
  ],
  match: {
    path: '/test-page',
    url: '/test-page',
    isExact: true,
    params: {},
  },
}

describe('<Breadcrumb />', () => {
  const wrapper = shallow(<Breadcrumb {...props} />)

  it('should display the correct amount of breadcrumbs', () => {
    expect(wrapper.find('BreadcrumbItem').length).toBe(3)
  })

  it('should have the Home link as the first Breadcrumb ', () => {
    expect(
      wrapper
        .find('BreadcrumbItem')
        .first()
        .find('a')
        .text()
    ).toEqual('Home')
  })

  it('should link back to the Application homepage', () => {
    const breadcrumbItem = wrapper.find('BreadcrumbItem').at(1)

    expect(breadcrumbItem.find('Link').prop('to')).toEqual('/')
    expect(breadcrumbItem.find('span').text()).toEqual('Application homepage')
  })

  it('should not apply a link to the current page breadcrumb', () => {
    const breadcrumbItem = wrapper.find('BreadcrumbItem').last()

    expect(breadcrumbItem.find('Link').exists()).toBe(false)
    expect(breadcrumbItem.find('span').text()).toEqual('Test page')
  })
})
