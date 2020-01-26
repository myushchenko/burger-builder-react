export const updateObject = (oldObject, updatedValues) => {
  return {
    ...oldObject,
    ...updatedValues
  };
};

export const checkValidity = (value, rules) => {
  let isValid = true;
  if (!rules) {
    return isValid;
  }
  if (rules.required) {
    isValid = value.trim() !== "" && isValid;
  }
  if (rules.minLength) {
    isValid = value.length >= rules.minLength && isValid;
  }
  if (rules.maxLength) {
    isValid = value.length <= rules.maxLength && isValid;
  }
  if (rules.isEmail) {
    const pattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/gim;
    isValid = pattern.test(value) && isValid;
  }
  if (rules.isNumeric) {
    const pattern = /^\d+$/;
    isValid = pattern.test(value) && isValid;
  }
  return isValid;
};

export const updateForm = (form, inputKey, value) => {
  return {
    ...form,
    [inputKey]: {
      ...form[inputKey],
      value,
      valid: checkValidity(value, form[inputKey].validation),
      touched: true
    }
  };
};
