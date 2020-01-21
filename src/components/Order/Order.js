import React from "react";

import classes from "./Order.module.css";

const order = props => {
  let ingredients = [];

  for (const name in props.ingredients) {
    ingredients.push({
      name,
      amount: props.ingredients[name]
    });
  }

  const ingredientOutput = ingredients.map(ig => {
    return (
      <span className={classes.Ingerident} key={ig.name}>
        {ig.name} ({ig.amount})
      </span>
    );
  });

  return (
    <div className={classes.Order}>
      <p>Ingredients: {ingredientOutput}</p>
      <p>
        Price: <strong>${props.price.toFixed(2)}</strong>
      </p>
    </div>
  );
};

export default order;
