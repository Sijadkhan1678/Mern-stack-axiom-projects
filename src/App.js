import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import Search from './components/users/Search';
import Alert from './components/layout/Alert';
import About from './components/pages/About';
import User from './components/users/User';
import axios from 'axios';
import './app.css';

class App extends Component {
  state = {
    users: [],
    user: {},
    repos: [],
    loading: false,
    alert: null,
  };
  Searchuser = async (text) => {
    this.setState({ loading: true });
    const res = await axios.get(
      `https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLEINT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLEINT_SECRET}`
    );

    this.setState({ users: res.data.items, loading: false });
  };
  getUser = async (username) => {
    this.setState({ loading: true });
    const res = await axios.get(
      `https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_GITHUB_CLEINT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLEINT_SECRET}`
    );
    this.setState({ user: res.data, loading: false });
  };
  // getUserRepos= async (username)=>{
  //   this.setState({loading: true})
  //   const res= await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_GITHUB_CLEINT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLEINT_SECRET}`)
  //   this.setState({repos: res.data,loading: false})
  //   console.log(res.data)
  // }

  setAlert = (msg, type) => {
    this.setState({ alert: { msg, type } });
    setTimeout(() => this.setState({ alert: null }), 5000);
  };
  clearUsers = () => {
    this.setState({ users: [] });
  };
  removeAlert = () => {
    this.setState({ alert: null });
  };

  render() {
    const { users, user,repos,loading,alert } = this.state;
    return (
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Alert removeAlert={this.removeAlert} alert={alert} />
            <Switch>
              {/* Route for the home page */}
              <Route
                exact
                path="/"
                render={(props) => (
                  <Fragment>
                    <Search
                      Searchuser={this.Searchuser}
                      clearUsers={this.clearUsers}
                      showClear={users.length > 0 ? true : false}
                      setAlert={this.setAlert}
                    />
                    <Users loading={loading} users={users} />
                  </Fragment>
                )}
              />
              <Route exact path="/about" component={About} />

              <Route
                exact
                path="/user/:login"
                render={(props) => (
                  <User
                    {...props}
                    getUser={this.getUser}
                    getUserRepos={this.getUserRepos}
                    repos={repos}
                    user={user}
                    loading={loading}
                  />
                )}
              />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}
export default App;
