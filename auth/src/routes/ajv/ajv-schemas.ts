const signupSchema = {
  type: "object",

  properties: {
    username: {
      type: "string",
      minLength: 8,
      maxLength: 64,
      errorMessage: {
        type: " must be string",
        minLength: " must be at least 8 characters",
        maxLength: " must be no more than  64 characters",
      },
    },

    password: {
      type: "string",
      minLength: 8,
      maxLength: 64,
      pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).*$",
      errorMessage: {
        type: " must be string",
        minLength: " must be at least 8 characters",
        maxLength: " must be no more than  64 characters",
        pattern:
          " must contain all of lowercase, capital letter and special characters",
      },
    },

    //set this field equal to password by using a json relative pointer
    repeat_password: {
      type: "string",
      const: { $data: "1/password" },
      errorMessage: {
        type: " must be string",
        const: " must be exactly equal to password",
      },
    },

    email: {
      type: "string",
      format: "email",
      errorMessage: {
        type: " must be string",
        format: " must have a valid email format",
      },
    },
  },
  required: ["username", "password", "email", "repeat_password"],
  errorMessage: {
    type: "should be an object",
    required: {
      username: 'should have an string property "username"',
      password: 'should have a string property "password"',
      repeat_password: 'should have an string property "repeat_password"',
      email: 'should have a string property "email"',
    },
  },
  additionalProperties: false,
};

type SignupType = {
  type: string;
  properties: {
    username: Object;
    password: Object;
    repeat_password: Object;
    email: Object;
  };
  required: Array<string>;
  errorMessage: Object;
  additionalProperties: boolean;
};

const signinSchema = {
  type: "object",

  properties: {
    username: {
      type: "string",
      minLength: 8,
      maxLength: 64,
      errorMessage: {
        type: " must be string",
        minLength: " must be at least 8 characters",
        maxLength: " must be no more than  64 characters",
      },
    },

    password: {
      type: "string",
      minLength: 8,
      maxLength: 64,
      pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).*$",
      errorMessage: {
        type: " must be string",
        minLength: " must be at least 8 characters",
        maxLength: " must be no more than  64 characters",
        pattern:
          " must contain all of lowercase, capital letter and special characters",
      },
    },
  },
  required: ["username", "password"],
  errorMessage: {
    type: "should be an object",
    required: {
      username: 'should have an string property "username"',
      password: 'should have a string property "password"',
    },
  },
  additionalProperties: false,
};

type SigninType = {
  type: string;
  properties: {
    username: Object;
    password: Object;
  };
  required: Array<string>;
  errorMessage: Object;
  additionalProperties: boolean;
};

export { SignupType, signupSchema, SigninType, signinSchema };
