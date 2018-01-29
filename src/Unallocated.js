import React, { Component } from 'react';
import axios from 'axios';

class Unallocated extends Component {
  constructor (props) {
    super();
    console.log('in constructor ' + props.jwt);
  }

  async componentWillMount () {
    console.log('in componentWillMount');
    try {
      const response = await axios.get('/unallocated', {
        headers: {
          jwt: this.props.jwt
        }
      });
      console.log('data from api call ' + response);
      this.props.setUnallocatedOffenders(response.data);
    } catch (error) {
      this.props.displayError(error);
    }
  }

  render () {
    const offenders = this.props.list.map((a) => {
      return (
        <tr>
          <td className="row-gutters"><a href={a.bookingId}>{a.lastName}, {a.firstName}</a></td>
          <td className="row-gutters">{a.offenderNo}</td>
          <td className="row-gutters">{a.internalLocationDesc}</td>
          <td className="row-gutters">release date todo</td>
          <td className="row-gutters">csra todo</td>
        </tr>
      );
    });
    return (
      <div>
        <div className="pure-u-md-7-12">
          <h1 className="heading-large">Prisoners without key workers</h1>
          <p>These prisoners have not yet been allocated a Key worker. Use the button below to automatically allocate
            them to one. You can override the selections on the next page if you wish.</p>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>NOMS ID</th>
                <th>Location</th>
                <th>RD</th>
                <th>CSRA</th>
              </tr>
            </thead>
            <tbody>{offenders}</tbody>
          </table>
        </div>
        <div>
          <button className="button top-gutter" onClick={() => this.props.onAllocate(this.props.history)}>Allocate</button>
        </div>
      </div>
    );
  }
}

export default Unallocated;
