import React, { Component } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import Layout from "./hoc/Layout/Layout";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";

import * as actions from "./store/actions/index";
import asyncComponent from "./hoc/asyncComponent/asyncComponent";

const asyncCheckout = asyncComponent(() =>
  import("./containers/Checkout/Checkout")
);
const asyncOrders = asyncComponent(() => import("./containers/Orders/Orders"));
const asyncAuth = asyncComponent(() => import("./containers/Auth/Auth"));
const asyncLogout = asyncComponent(() =>
  import("./containers/Auth/Logout/Logout")
);

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignin();
  }

  render() {
    let routes = (
      <Switch>
        <Route path="/auth" component={asyncAuth} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/" />
      </Switch>
    );
    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/checkout" component={asyncCheckout} />
          <Route path="/orders" component={asyncOrders} />
          <Route path="/logout" component={asyncLogout} />
          <Route path="/auth" component={asyncAuth} />
          <Route path="/" exact component={BurgerBuilder} />
          <Redirect to="/" />
        </Switch>
      );
    }
    return (
      <div>
        <Layout>{routes}</Layout>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: !!state.auth.token
  };
};

const mapDispatchTOProps = dispatch => {
  return {
    onTryAutoSignin: () => dispatch(actions.authCheckStatus())
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchTOProps)(App));
