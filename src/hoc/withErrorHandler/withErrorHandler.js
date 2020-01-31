import React from "react";

import Modal from "../../components/UI/Modal/Modal";
import Aux from "../Auxiliary/Auxiliary";
import useHttpErrorHandler from "../../hooks/http-error-handler";

const WithErrorHandler = (WrappedComponent, axios) => {
  const WithErrorHandlerComponent = props => {
    const [error, clearError] = useHttpErrorHandler(axios);

    return (
      <Aux>
        <Modal modalClosed={clearError} show={error}>
          {error ? error.message : null}
        </Modal>
        <WrappedComponent {...props} />
      </Aux>
    );
  };
  return WithErrorHandlerComponent;
};

export default WithErrorHandler;
