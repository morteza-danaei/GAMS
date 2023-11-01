/**
 * An AJV schema for validating a user object for signing up.

 * This schema requires the following properties:
 * - username: A string of at least 8 and at most 64 characters.
 * - password: A string of at least 8 and at most 64 characters, containing lowercase, capital letter, and special characters.
 * - repeat_password: A string that is exactly equal to the password.
 * - email: A valid email address.

 * All of these properties are required.
 */
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

    // This code segment sets repeat_password to be equal
    // to password by using a json relative pointer
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

/**
 * A TypeScript type that corresponds to the `signupSchema` AJV schema.
 */
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

/**
 * An AJV schema for validating a user object for signing in.

 * This schema requires the following properties:
 * - username: A string of at least 8 and at most 64 characters.
 * - password: A string of at least 8 and at most 64 characters, containing lowercase, capital letter, and special characters.

 * All of these properties are required.
 */
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

/**
 * A TypeScript type that corresponds to the `signinSchema` AJV schema.
 */
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
