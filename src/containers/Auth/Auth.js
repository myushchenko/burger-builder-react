import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/Spinner/Spinner";
import classes from "./Auth.module.css";
import * as actions from "../../store/actions/index";
import { Redirect } from "react-router-dom";
import { updateForm } from "../../shared/utility";

const Auth = props => {
  const [isSignup, setIsSignup] = useState(false);
  const [authForm, setAuthForm] = useState({
    email: {
      elementType: "input",
      elementConfig: {
        type: "email",
        placeholder: "Mail Address"
      },
      value: "",
      validation: {
        required: true,
        isEmail: true
      },
      valid: false,
      touched: false
    },
    password: {
      elementType: "input",
      elementConfig: {
        type: "password",
        placeholder: "Password"
      },
      value: "",
      validation: {
        required: true,
        minLength: 6
      },
      valid: false,
      touched: false
    }
  });

  const { onSetAuthRedirectPath, buildingBurger, authRedirectPath } = props;

  useEffect(() => {
    if (!buildingBurger && authRedirectPath !== "/") {
      onSetAuthRedirectPath();
    }
  }, [onSetAuthRedirectPath, buildingBurger, authRedirectPath]);

  const inputChangedHandler = (event, inputKey) => {
    const updatedAuthForm = updateForm(authForm, inputKey, event.target.value);
    setAuthForm(updatedAuthForm);
  };

  const submitHandler = event => {
    event.preventDefault();
    props.onAuth(authForm.email.value, authForm.password.value, isSignup);
  };

  const switchAuthModeHandler = () => {
    setIsSignup(!isSignup);
  };

  const formElements = [];
  for (const key in authForm) {
    formElements.push({
      id: key,
      config: authForm[key]
    });
  }

  let form = (
    <form onSubmit={submitHandler}>
      {formElements.map(el => (
        <Input
          key={el.id}
          inputType={el.config.elementType}
          elementConfig={el.config.elementConfig}
          value={el.config.value}
          invalid={!el.config.valid}
          shoudValidate={!!el.config.validation}
          touched={el.config.touched}
          changed={event => inputChangedHandler(event, el.id)}
        />
      ))}
      <Button btnType="Success">SUBMIT</Button>
    </form>
  );

  if (props.loading) {
    form = <Spinner />;
  }

  let errorMessage = null;
  if (props.error) {
    errorMessage = <p>{props.error.message}</p>;
  }

  let authRedirect = null;
  if (props.isAuthenticated) {
    authRedirect = <Redirect to={props.authRedirectPath} />;
  }
  return (
    <div className={classes.Auth}>
      {authRedirect}
      {errorMessage}
      {form}
      <Button btnType="Danger" clicked={switchAuthModeHandler}>
        SWITCH TO {isSignup ? "SIGNIN" : "SIGNUP"}
      </Button>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: !!state.auth.token,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignup) =>
      dispatch(actions.auth(email, password, isSignup)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath("/"))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
