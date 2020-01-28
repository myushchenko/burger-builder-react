import { takeEvery, takeLatest, all } from "redux-saga/effects";

import * as actionsTypes from "../actions/actionTypes";
import {
  logoutSaga,
  checkAuthTimeoutSaga,
  authUserSaga,
  authCheckStateSaga
} from "./auth";

import { initIngredientsSaga } from "./burgerBuilder";

import { purchaseBurgerSaga, fetchOrdersSaga } from "./order";

export function* watchAuth() {
  // run simultaneously
  yield all([
    takeEvery(actionsTypes.AUTH_INITIATE_LOGOUT, logoutSaga),
    takeEvery(actionsTypes.AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga),
    takeEvery(actionsTypes.AUTH_USER, authUserSaga),
    takeEvery(actionsTypes.AUTH_CHECK_STATE, authCheckStateSaga)
  ]);
}

export function* watchBurgerBuilder() {
  yield takeEvery(actionsTypes.INIT_INGREDIENTS, initIngredientsSaga);
}

export function* watchOrder() {
  // cancel previous sagas
  yield takeLatest(actionsTypes.PURCHASE_BURGER, purchaseBurgerSaga);
  yield takeEvery(actionsTypes.FETCH_ORDERS, fetchOrdersSaga);
}
