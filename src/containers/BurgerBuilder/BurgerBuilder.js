import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "../../axios-orders";

import * as actions from "../../store/actions/index";

import Aux from "../../hoc/Auxiliary/Auxiliary";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

export const BurgerBuilder = props => {
  const [purchasing, setPurchasing] = useState(false);

  const dispatch = useDispatch();

  const ingredients = useSelector(state => state.burgerBuilder.ingredients);
  const totalPrice = useSelector(state => state.burgerBuilder.totalPrice);
  const error = useSelector(state => !!state.auth.token);
  const isAuthenticated = useSelector(state => state.burgerBuilder.error);

  const onIngredientAdded = ingredientName =>
    dispatch(actions.addIngredient(ingredientName));
  const onIngredientRemoved = ingredientName =>
    dispatch(actions.removeIngredient(ingredientName));
  const onInitIngredients = useCallback(
    () => dispatch(actions.initIngredients()),
    [dispatch]
  );
  const onInitPurchase = () => dispatch(actions.purchaseInit());
  const onSetAuthRedirectPath = path =>
    dispatch(actions.setAuthRedirectPath(path));

  useEffect(() => {
    onInitIngredients();
  }, [onInitIngredients]);

  const updatePurchaseState = ingredients => {
    const sum = Object.values(ingredients).reduce((sum, el) => sum + el, 0);
    return sum > 0;
  };

  const purchaseHandler = () => {
    if (isAuthenticated) {
      setPurchasing(true);
    } else {
      onSetAuthRedirectPath("/checkout");
      props.history.push("/auth");
    }
  };

  const purchaseCancelHandler = () => {
    setPurchasing(false);
  };

  const purchaseContinueHandler = () => {
    onInitPurchase();
    props.history.push("/checkout");
  };

  const disabledInfo = {
    ...ingredients
  };
  for (let key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0;
  }
  let orderSummary = null;
  let burger = error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

  if (ingredients) {
    burger = (
      <Aux>
        <Burger ingredients={ingredients} />
        <BuildControls
          ingredientsAdded={onIngredientAdded}
          ingredientsRemoved={onIngredientRemoved}
          ordered={purchaseHandler}
          disabledInfo={disabledInfo}
          purchasable={updatePurchaseState(ingredients)}
          price={totalPrice}
          isAuth={isAuthenticated}
        />
      </Aux>
    );
    orderSummary = (
      <OrderSummary
        price={totalPrice}
        ingredients={ingredients}
        purchaseCancel={purchaseCancelHandler}
        purchaseContinue={purchaseContinueHandler}
      />
    );
  }

  return (
    <Aux>
      <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </Aux>
  );
};

export default withErrorHandler(BurgerBuilder, axios);

// const mapStateToProps = state => {
//   return {
//     ingredients: state.burgerBuilder.ingredients,
//     totalPrice: state.burgerBuilder.totalPrice,
//     error: state.burgerBuilder.error,
//     isAuthenticated: !!state.auth.token
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     onIngredientAdded: ingredientName =>
//       dispatch(actions.addIngredient(ingredientName)),
//     onIngredientRemoved: ingredientName =>
//       dispatch(actions.removeIngredient(ingredientName)),
//     onInitIngredients: () => dispatch(actions.initIngredients()),
//     onInitPurchase: () => dispatch(actions.purchaseInit()),
//     onSetAuthRedirectPath: path => dispatch(actions.setAuthRedirectPath(path))
//   };
// };

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(withErrorHandler(BurgerBuilder, axios));
