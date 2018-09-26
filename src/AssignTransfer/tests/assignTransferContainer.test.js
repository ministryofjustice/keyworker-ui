import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { AssignTransferContainer } from "../AssignTransferContainer";

jest.mock('../../Spinner/index', () => '');

Enzyme.configure({ adapter: new Adapter() });

describe('AssignTransferContainer', () => {
  it('should render initial Search correctly', async () => {
    const component = shallow(<AssignTransferContainer initialSearch displayBack={jest.fn()} setErrorDispatch={() => {}}/>);
    expect(component.find('div').at(1).text()).toContain('Search for an offender');
  });

  it('should render results correctly', async () => {
    const component = shallow(<AssignTransferContainer setErrorDispatch={() => {}}/>);
    const connect = component.find('Connect');
    expect(connect.text()).toContain('OffenderResultsContainer');
  });
});
