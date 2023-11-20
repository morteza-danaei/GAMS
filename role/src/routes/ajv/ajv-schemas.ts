/**
 * A JSON schema that defines the structure and validation rules for a role object.
 */
const roleSchema = {
  type: "object",

  properties: {
    name: {
      type: "string",
      minLength: 1,
      maxLength: 50,
      errorMessage: {
        type: " must be string",
        minLength: " must have at least 1 characters",
        maxLength: " must have no more than 50 characters",
      },
    },
  },
  required: ["name"],
  errorMessage: {
    type: "should be an object",
    required: {
      name: 'should have a string property "name"',
    },
  },
  additionalProperties: false,
};

/**
 * A TypeScript type that corresponds to the `roleSchema` JSON schema.
 */
type RoleType = {
  type: string;
  properties: {
    name: Object;
  };
  required: Array<string>;
  errorMessage: Object;
  additionalProperties: boolean;
};

export { RoleType, roleSchema };
