import React, { useState } from "react";

import axios from "../../../axios-orders";

import Button from "../../../components/UI/Button/Button";
import classes from "./ContactData.module.css";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import { connect } from "react-redux";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import * as orderActions from "../../../store/actions/index";
import { updateForm } from "../../../shared/utility";
import { orderFormInitialState } from "./orderForm";

const ContactData = props => {
  const [formIsValid, setFormIsValid] = useState(false);
  const [orderForm, setOrderForm] = useState(orderFormInitialState);

  const orderHandler = event => {
    event.preventDefault();

    const formData = {};
    for (const inputKey in orderForm) {
      formData[inputKey] = orderForm[inputKey].value;
    }
    const order = {
      ingredients: props.ingredients,
      price: props.price,
      orderData: formData,
      userId: props.userId
    };
    props.onOrderBurger(order, props.token);
  };

  const inputChangedHandler = (event, inputKey) => {
    const updatedOrderForm = updateForm(
      orderForm,
      inputKey,
      event.target.value
    );

    let isFormValid = true;
    for (const inputKey in updatedOrderForm) {
      isFormValid = updatedOrderForm[inputKey].valid && isFormValid;
    }
    setOrderForm(updatedOrderForm);
    setFormIsValid(isFormValid);
  };

  const formElements = [];
  for (const key in orderForm) {
    formElements.push({
      id: key,
      config: orderForm[key]
    });
  }
  let form = (
    <form onSubmit={orderHandler}>
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
      <Button btnType="Success" disabled={!formIsValid}>
        ORDER
      </Button>
    </form>
  );
  if (props.loading) {
    form = <Spinner />;
  }
  return (
    <div className={classes.ContactData}>
      <h4>Enter your Contact Data</h4>
      {form}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onOrderBurger: (orderData, token) =>
      dispatch(orderActions.purchaseBurger(orderData, token))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(ContactData, axios));
