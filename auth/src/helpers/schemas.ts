const signupSchema = {
  type: "object",
  properties: {
    username: { type: "string", minimum: 4, maximum: 20 },
    password: {
      type: "string",
      format: "password",
    },

    //set this field equal to password by using a json relative pointer
    repeat_password: { type: "string", const: { $data: "1/password" } },
    email: { type: "string", format: "email" },
  },
  required: ["username", "password", "email", "repeat_password"],
  additionalProperties: false,
};

type Signup = {
  type: string;
  properties: {
    username: Object;
    password: Object;
    repeat_password: Object;
    email: Object;
  };
  required: Array<string>;
  additionalProperties: boolean;
};
const signinSchema = {
  type: "object",
  properties: {
    username: { type: "string", minimum: 4, maximum: 20 },
    password: {
      type: "string",
      format: "password",
    },
  },
  required: ["username", "password"],
  additionalProperties: false,
};

type Signin = {
  type: string;
  properties: {
    username: Object;
    password: Object;
  };
  required: Array<string>;
  additionalProperties: boolean;
};

export {
  Signup as SignupType,
  signupSchema,
  Signin as SigninType,
  signinSchema,
};
