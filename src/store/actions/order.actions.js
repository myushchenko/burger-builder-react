import * as actionTypes from "./actionTypes";
import axios from "../../axios-orders";

export const purchaseInit = () => {
  return { type: actionTypes.PURCHASE_INIT };
};

export const purchaseBurgerSuccess = (orderId, orderData) => {
  return { type: actionTypes.PURCHASE_BURGER_SUCCESS, orderId, orderData };
};

export const purchaseBurgerFail = error => {
  return { type: actionTypes.PURCHASE_BURGER_FAIL, error };
};

export const purchaseBurgerStart = () => {
  return { type: actionTypes.PURCHASE_BURGER_START };
};

export const purchaseBurger = orderData => {
  return dispatch => {
    dispatch(purchaseBurgerStart());
    axios
      .post("/orders.json", orderData)
      .then(reponse => {
        dispatch(purchaseBurgerSuccess(reponse.data.name, orderData));
      })
      .catch(error => {
        dispatch(purchaseBurgerFail(error));
      });
  };
};

export const fetchOrdersSuccess = orders => {
  return { type: actionTypes.FETCH_ORDERS_SUCCESS, orders };
};

export const fetchOrdersFail = error => {
  return { type: actionTypes.FETCH_ORDERS_FAIL, error };
};

export const fetchOrdersStart = () => {
  return { type: actionTypes.FETCH_ORDERS_START };
};

export const fetchOrders = () => {
  return dispatch => {
    dispatch(fetchOrdersStart());
    axios
      .get("/orders.json")
      .then(res => {
        const fetchedOrders = [];
        for (const key in res.data) {
          if (res.data.hasOwnProperty(key)) {
            fetchedOrders.push({
              id: key,
              ...res.data[key]
            });
          }
        }
        dispatch(fetchOrdersSuccess(fetchedOrders));
      })
      .catch(error => {
        dispatch(fetchOrdersFail(error));
      });
  };
};
