const personnelSchema = {
  type: "object",

  properties: {
    pid: {
      type: "string",
      minLength: 8,
      maxLength: 8,
      errorMessage: {
        type: " must be string",
        minLength: " must be exactly 8 characters",
        maxLength: " must be exactly 8 characters",
      },
    },
    nid: {
      type: "string",
      minLength: 10,
      maxLength: 10,
      errorMessage: {
        type: " must be string",
        minLength: " must be exactly 10 characters",
        maxLength: " must be exactly 10 characters",
      },
    },

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
    lastname: {
      type: "string",
      minLength: 1,
      maxLength: 50,
      errorMessage: {
        type: " must be string",
        minLength: " must have at least 1 characters",
        maxLength: " must have no more than 50 characters",
      },
    },
    department: {
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

  required: ["pid", "nid", "name", "lastname", "department"],
  errorMessage: {
    type: "should be an object",
    required: {
      pid: 'should have a string property "pid"',
      nid: 'should have a string property "nid"',
      name: 'should have a string property "name"',
      lastname: 'should have a string property "lastname"',
      department: 'should have a string property "department"',
    },
  },
  additionalProperties: false,
};

type PersonnelType = {
  type: string;
  properties: {
    pid: Object;
    nid: Object;
    name: Object;
    lastname: Object;
    department: Object;
  };
  required: Array<string>;
  errorMessage: Object;
  additionalProperties: boolean;
};

export { PersonnelType, personnelSchema };
