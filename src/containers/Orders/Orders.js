import React, { useEffect } from "react";
import { connect } from "react-redux";

import * as actions from "../../store/actions/index";
import axios from "../../axios-orders";

import Order from "../../components/Order/Order";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import Spinner from "../../components/UI/Spinner/Spinner";

import classes from "./Orders.module.css";

const Orders = props => {
  const { onFetchOrders, token, userId } = props;

  useEffect(() => {
    onFetchOrders(token, userId);
  }, [onFetchOrders, token, userId]);

  let orders = <Spinner />;
  if (!props.loading) {
    if (props.orders && props.orders.length) {
      orders = props.orders.map(order => (
        <Order
          key={order.id}
          ingredients={order.ingredients}
          price={order.price}
        />
      ));
    } else {
      orders = <p className={classes.Empty}>You don't have orders!</p>;
    }
  }
  return <div>{orders}</div>;
};

const mapStateToProps = state => {
  return {
    orders: state.order.orders,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrders: (token, userId) =>
      dispatch(actions.fetchOrders(token, userId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(Orders, axios));
