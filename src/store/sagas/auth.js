import axios from "axios";
import { put, delay, call } from "redux-saga/effects";

import * as actions from "../actions";

const API_KEY = "AIzaSyAqT17gunE18emrqO2Pso8Whvtrd2eR9oo";

// generators
export function* logoutSaga(action) {
  yield call([localStorage, "removeItem"], "token");
  yield call([localStorage, "removeItem"], "userId");
  yield call([localStorage, "removeItem"], "expirationDate");
  // yield localStorage.removeItem("token");
  // yield localStorage.removeItem("userId");
  // yield localStorage.removeItem("expirationDate");

  // dispatch new action
  yield put(actions.logoutSucceed());
}

export function* checkAuthTimeoutSaga(action) {
  yield delay(action.expirationTime * 1000);
  yield put(actions.logout());
}

export function* authUserSaga(action) {
  yield put(actions.authStart());

  const authData = {
    email: action.email,
    password: action.password,
    returnSecureToken: true
  };
  let authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
  if (!action.isSignup) {
    authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
  }
  try {
    const response = yield axios.post(authUrl, authData);

    const expirationDate = yield new Date(
      new Date().getTime() + response.data.expiresIn * 1000
    );
    yield localStorage.setItem("token", response.data.idToken);
    yield localStorage.setItem("userId", response.data.localId);
    yield localStorage.setItem("expirationDate", expirationDate);

    yield put(
      actions.authSuccess(response.data.idToken, response.data.localId)
    );
    yield put(actions.checkAuthTimeout(response.data.expiresIn));
  } catch (error) {
    yield put(actions.authFail(error.response.data.error));
  }
}

export function* authCheckStateSaga(action) {
  const token = yield localStorage.getItem("token");
  if (!token) {
    yield put(actions.logout());
  } else {
    const expirationDate = yield new Date(
      localStorage.getItem("expirationDate")
    );
    if (expirationDate > new Date()) {
      const userId = yield localStorage.getItem("userId");
      const expiresIn =
        (expirationDate.getTime() - new Date().getTime()) / 1000;
      yield put(actions.authSuccess(token, userId));
      yield put(actions.checkAuthTimeout(expiresIn));
    } else {
      yield put(actions.logout());
    }
  }
}
