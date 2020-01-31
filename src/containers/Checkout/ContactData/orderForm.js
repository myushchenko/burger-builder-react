export const orderFormInitialState = {
  name: {
    elementType: "input",
    elementConfig: {
      type: "text",
      placeholder: "Your name"
    },
    value: "",
    validation: {
      required: true
    },
    valid: false,
    touched: false
  },
  street: {
    elementType: "input",
    elementConfig: {
      type: "text",
      placeholder: "Street"
    },
    value: "",
    validation: {
      required: true
    },
    valid: false,
    touched: false
  },
  zipCode: {
    elementType: "input",
    elementConfig: {
      type: "text",
      placeholder: "ZIP Code"
    },
    value: "",
    validation: {
      required: true,
      isNumeric: true,
      minLength: 5,
      maxLength: 5
    },
    valid: false,
    touched: false
  },
  country: {
    elementType: "input",
    elementConfig: {
      type: "text",
      placeholder: "Country"
    },
    value: "",
    validation: {
      required: true
    },
    valid: false,
    touched: false
  },
  email: {
    elementType: "input",
    elementConfig: {
      type: "email",
      placeholder: "Your E-Mail"
    },
    value: "",
    validation: {
      required: true,
      isEmail: true
    },
    valid: false,
    touched: false
  },
  deliveryMethod: {
    elementType: "select",
    elementConfig: {
      options: [
        { value: "fastest", displayValue: "Fastest" },
        { value: "cheapest", displayValue: "Cheapest" }
      ]
    },
    value: "fastest",
    validation: {},
    valid: true
  }
};
