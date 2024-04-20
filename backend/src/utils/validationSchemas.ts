const createUserValidationSchema = {
  email: {
    notEmpty: {
      errorMessage: "email is required",
    },
    isString: {
      errorMessage: "email must be a string",
    },
  },
  firstName: {
    notEmpty: {
      errorMessage: "first name is required",
    },
    isString: {
      errorMessage: "first name must be a string",
    },
  },
  lastName: {
    notEmpty: {
      errorMessage: "last name is required",
    },
    isString: {
      errorMessage: "last name must be a string",
    },
  },
  password: {
    isLength: {
      options: {
        min: 8,
        max: 16,
      },
      errorMessage:
        "password must be at least 8 characters with a max of 16 characters",
    },
    notEmpty: {
      errorMessage: "password is required",
    },
  },
};

const userLoginValidationSchema = {
  email: {
    notEmpty: {
      errorMessage: "email is required",
    },
    isString: {
      errorMessage: "email must be a string",
    },
  },
  password: {
    isLength: {
      options: {
        min: 8,
        max: 16,
      },
      errorMessage:
        "password must be at least 8 characters with a max of 16 characters",
    },
    notEmpty: {
      errorMessage: "password is required",
    },
  },
};

export { createUserValidationSchema, userLoginValidationSchema };
