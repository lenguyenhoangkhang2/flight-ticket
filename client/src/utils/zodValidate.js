import _ from "lodash";

const zodValidate = (zodValidateErrors, path) => {
  const errors = _.filter(zodValidateErrors, (error) =>
    _.isEqual(error.path, path)
  );

  return {
    hasError: !_.isEmpty(errors),
    message: errors.length ? errors[0].message : null,
  };
};

export default zodValidate;
