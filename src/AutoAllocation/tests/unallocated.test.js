import React from 'react'
import { shallow } from 'enzyme'
import Unallocated from '../components/Unallocated'
import links from '../../links'
import mockHistory from '../../test/mockHistory'

const list = [
  {
    bookingId: 1,
    lastName: 'Rendell',
    firstName: 'Steve',
    offenderNo: 'ZZ124WX',
    assignedLivingUnitDesc: 'L-1-1',
    confirmedReleaseDate: '2020-01-02',
    crsaClassification: 'High',
    agencyId: '1',
    assignedLivingUnitId: 1,
    dateOfBirth: '1980-01-01',
    facialImageId: 1,
  },
  {
    bookingId: 2,
    lastName: 'Rendell2',
    firstName: 'Steve2',
    offenderNo: 'ZZ125WX',
    assignedLivingUnitDesc: 'L-1-2',
    confirmedReleaseDate: null,
    crsaClassification: 'Medium',
    agencyId: '2',
    assignedLivingUnitId: 2,
    dateOfBirth: '1980-01-01',
    facialImageId: 2,
  },
]

const mockBack = () => <a href="test">home</a>

describe('Unallocated component', () => {
  it('should render list correctly', () => {
    links.notmEndpointUrl = 'http://my.testUrl/'
    const component = shallow(
      <Unallocated loaded unallocatedList={list} displayBack={mockBack} gotoNext={() => {}} history={mockHistory} />
    )

    expect(component).toMatchSnapshot()
  })

  it('should handle click correctly', async () => {
    const callBack = jest.fn()

    const component = shallow(
      <Unallocated loaded unallocatedList={list} displayBack={mockBack} gotoNext={callBack} history={mockHistory} />
    )

    component.find('button').simulate('click')
    expect(callBack.mock.calls.length).toEqual(1)
  })

  it('should omit button and show message when no list 1', async () => {
    const component = shallow(
      <Unallocated loaded displayBack={mockBack} gotoNext={jest.fn()} history={mockHistory} unallocatedList={[]} />
    )

    expect(component.find('button')).toHaveLength(0)
    expect(component.find('.font-small').debug()).toMatch('No prisoners found')
  })

  it('should omit button and show message when no list 2', async () => {
    const component = shallow(
      <Unallocated loaded unallocatedList={[]} displayBack={mockBack} gotoNext={jest.fn()} history={mockHistory} />
    )

    expect(component.find('button')).toHaveLength(0)
    expect(component.find('.font-small').debug()).toMatch('No prisoners found')
  })
})
