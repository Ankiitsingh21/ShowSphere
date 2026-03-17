import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);

      const response = await axios[method](url, {
        ...body,
        ...props,
      });

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      let errorMessages = [];

      if (err.response?.data?.errors) {
        // Expected format: { errors: [{ message: "" }] }
        errorMessages = err.response.data.errors.map((e) => e.message);
      } else if (err.response?.data?.message) {
        // Common API error (e.g., 404)
        errorMessages = [err.response.data.message];
      } else if (err.message) {
        // Network / unknown error
        errorMessages = [err.message];
      } else {
        errorMessages = ["Something went wrong"];
      }

      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {errorMessages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        </div>,
      );
    }
  };

  return { doRequest, errors };
};
