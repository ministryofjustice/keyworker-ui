import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { UnallocatedContainer } from "../containers/Unallocated";
import { ProvisionalContainer } from "../containers/Provisional";
import axiosWrapper from '../../backendWrapper';


const AXIOS_URL = 0;
const AXIOS_CONFIG = 1;

jest.mock('../../Spinner/index', () => 'div id="spinner"');


Enzyme.configure({ adapter: new Adapter() });

describe('Unallocated component', () => {
  it('should get unallocated page correctly', async () => {
    const mockAxios = jest.fn();
    axiosWrapper.get = mockAxios;

    mockAxios.mockImplementationOnce(() => Promise.resolve({ status: 200, data: ["s1", "s2"], config: {} }));

    await shallow(<UnallocatedContainer loaded agencyId={'LEI'} setMessageDispatch={jest.fn()} displayError={jest.fn()} unallocatedListDispatch={jest.fn()} setLoadedDispatch={jest.fn()}/>);

    expect(mockAxios.mock.calls.length).toBe(1);
    expect(mockAxios.mock.calls[0][0]).toBe('/api/unallocated');
  });

  it('should get spinner when page is loading - page loads unless loaded flag is provided', async () => {
    const mockAxios = jest.fn();
    axiosWrapper.get = mockAxios;

    mockAxios.mockImplementationOnce(() => Promise.resolve({ status: 200, data: ["s1", "s2"], config: {} }));

    const component = await shallow(<UnallocatedContainer agencyId={'LEI'} setMessageDispatch={jest.fn()} displayError={jest.fn()} unallocatedListDispatch={jest.fn()} setLoadedDispatch={jest.fn()}/>);
    expect(component.find('#spinner').exists());
  });

  it('should get provisional allocation page correctly', async () => {
    const mockAxios = jest.fn();
    axiosWrapper.get = mockAxios;
    // /unallocated
    mockAxios.mockImplementationOnce(() => Promise.resolve({ status: 200, data: ["s1", "s2"], config: {} }));
    // /allocated
    mockAxios.mockImplementationOnce(() => Promise.resolve({ status: 200, data: ["s3", "s4"], config: {} }));

    await shallow(<ProvisionalContainer loaded agencyId={'LEI'} onFinishAllocation={jest.fn()} setMessageDispatch={jest.fn()} displayError={jest.fn()}
      manualOverrideDispatch={jest.fn()} allocatedDetailsDispatch={jest.fn()} setLoadedDispatch={jest.fn()}/>);

    expect(mockAxios.mock.calls.length).toBe(1);
    expect(mockAxios.mock.calls[0][AXIOS_URL]).toBe('/api/allocated');
    expect(mockAxios.mock.calls[0][AXIOS_CONFIG].params.agencyId).toBe('LEI');
  });

  it('should render a middle tier error on unallocated page correctly', (done) => {
    const mockAxios = jest.fn(); // v22+ .mockName('mockAxios');
    const errorDispatch = jest.fn();
    axiosWrapper.get = mockAxios;
    // /unallocated
    mockAxios.mockImplementationOnce(() => Promise.reject(new Error("Request failed with status code 500,test error")));


    const component = shallow(<UnallocatedContainer loaded agencyId={'LEI'} displayError={errorDispatch} setMessageDispatch={jest.fn()} unallocatedListDispatch={jest.fn()} setLoadedDispatch={jest.fn()}
      error="Something went wrong: Error: Request failed with status code 500,test error"/>);


    setTimeout(() => {
      component.update();
      expect(mockAxios.mock.calls.length).toBe(1);
      expect(mockAxios.mock.calls[0][AXIOS_URL]).toBe('/api/unallocated');
      // const usefulDump = component.debug();
      expect(component.find('Error').exists()).toEqual(true);
      expect(component.find('Error').exists()).toEqual(true);
      expect(errorDispatch.mock.calls[0][0].message).toBe('Request failed with status code 500,test error');
      done();
    }, 5);
  });

  it('should render a middle tier error on provisional allocation page correctly', (done) => {
    const mockAxios = jest.fn();
    const errorDispatch = jest.fn();
    axiosWrapper.get = mockAxios;
    // /allocated
    mockAxios.mockImplementationOnce(() => Promise.reject(new Error("Request failed with status code 500,test error")));

    const component = shallow(<ProvisionalContainer loaded agencyId={'LEI'} onFinishAllocation={jest.fn()} displayError={errorDispatch} setMessageDispatch={jest.fn()}
      manualOverrideDispatch={jest.fn()} allocatedDetailsDispatch={jest.fn()} setLoadedDispatch={jest.fn()}
      error="Something went wrong: Error: Request failed with status code 500,test error"/>);

    console.log(component.debug());

    setTimeout(() => {
      component.update();
      expect(errorDispatch.mock.calls.length).toBe(1);
      expect(mockAxios.mock.calls.length).toBe(1);
      expect(mockAxios.mock.calls[0][AXIOS_URL]).toBe('/api/allocated');
      expect(component.find('Error').exists()).toEqual(true);
      expect(errorDispatch.mock.calls[0][0].message).toBe('Request failed with status code 500,test error');
      done();
    }, 5);
  });
});