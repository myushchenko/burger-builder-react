import axios from "axios";
import * as actionTypes from "./actionTypes";

const API_KEY = "AIzaSyAqT17gunE18emrqO2Pso8Whvtrd2eR9oo";

export const authStart = () => {
  return { type: actionTypes.AUTH_START };
};

export const authSuccess = (idToken, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken,
    userId
  };
};

export const authFail = error => {
  return { type: actionTypes.AUTH_FAIL, error };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("expirationDate");
  return { type: actionTypes.AUTH_LOGOUT };
};

export const checkAuthTimeout = expirationTime => {
  return dispatch => {
    setTimeout(() => dispatch(logout()), expirationTime * 1000);
  };
};

export const auth = (email, password, isSignup) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email,
      password,
      returnSecureToken: true
    };
    let authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
    if (!isSignup) {
      authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
    }
    axios
      .post(authUrl, authData)
      .then(response => {
        const expirationDate = new Date(
          new Date().getTime() + response.data.expiresIn * 1000
        );
        localStorage.setItem("token", response.data.idToken);
        localStorage.setItem("userId", response.data.localId);
        localStorage.setItem("expirationDate", expirationDate);
        dispatch(authSuccess(response.data.idToken, response.data.localId));
        dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch(error => {
        dispatch(authFail(error.response.data.error));
      });
  };
};

export const setAuthRedirectPath = path => {
  return { type: actionTypes.SET_AUTH_REDIRECT_PATH, path };
};

export const authCheckStatus = () => {
  return dispatch => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate > new Date()) {
        const userId = localStorage.getItem("userId");
        const expiresIn =
          (expirationDate.getTime() - new Date().getTime()) / 1000;
        dispatch(authSuccess(token, userId));
        dispatch(checkAuthTimeout(expiresIn));
      } else {
        dispatch(logout());
      }
    }
  };
};
