import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';
import { SERVER_URL } from '../constants.js';

class AddAssignment extends Component {
  constructor(props) {
    super(props);

    this.state = { name: '', dueDate: '', course: '', redirect: false };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    switch (event.target.id) {
      case 'name':
        this.setState({ name: event.target.value });
        break;
      case 'dueDate':
        this.setState({ dueDate: event.target.value });
        break;
      case 'course':
        this.setState({ course: event.target.value });
        break;
      default:
        break;
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.postAssignment();
  }

  postAssignment = () => {
    const token = Cookies.get('XSRF-TOKEN');
    fetch(`${SERVER_URL}/course/${this.state.course}/assignment`,
      {
        method: 'POST',
        headers: {
          'X-XSRF-TOKEN': token,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          credentials: 'include'
        },
        body: JSON.stringify({
          'assignmentName': this.state.name,
          'dueDate': new Date(this.state.dueDate).toISOString()
        })
      })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        this.setState({ ...this.state, redirect: true });
      })
      .catch(err => console.error(err));
  };

  render() {
    const { redirect } = this.state;

    if (redirect) {
      return <Redirect to='/'/>;
    }

    return (
      <div align="left">
        <h4 style={{ marginLeft: '3rem' }}>Add Assignment</h4>
        <form onSubmit={this.handleSubmit} style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          width: '25%',
          margin: '2rem'
        }}>
          <label style={{ display: 'block' }}>
            Name:
            <input id='name' type="text" value={this.state.name} onChange={this.handleChange}
                   style={{ display: 'block', margin: '.5rem' }}/>
          </label>
          <label style={{ display: 'block' }}>
            Due Date (e.g. 2021-09-18):
            <input id='dueDate' type="text" value={this.state.dueDate} onChange={this.handleChange}
                   style={{ display: 'block', margin: '.5rem' }}/>
          </label>
          <label style={{ display: 'block' }}>
            Course (id):
            <input id='course' type="text" value={this.state.course} onChange={this.handleChange}
                   style={{ display: 'block', margin: '.5rem' }}/>
          </label>
          <input type="submit" value="Submit" style={{ width: '50%', margin: '.5rem' }}/>
        </form>
      </div>
    );
  }
}

export default AddAssignment;
