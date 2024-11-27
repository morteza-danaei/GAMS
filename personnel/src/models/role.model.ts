import mongoose from "mongoose";

// An interface that describes the properties
// that are requried to create a new role
interface RoleProps {
  name: string;
}

// An interface that describes the properties
// that a role Document has
interface RoleDoc extends mongoose.Document {
  name: string;
}

// An interface that describes the properties
// that a role Model has
interface RoleModel extends mongoose.Model<RoleDoc> {
  /**
   *{@link role.(build:static) | the build() static method that creates a role}
   *
   */
  build(props: RoleProps): RoleDoc;
}

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    //TODO: add other properties/fields
  },
  {
    // The following code is used to change _id prop in document
    // to id
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

/**
 * A static factory method of role model that creates a new Role.

 * @param props - The properties of the role object to be created
 * @returns a  role instance with properties equal to props
 */
roleSchema.statics.build = (props: RoleProps) => {
  return new Role(props);
};

const Role = mongoose.model<RoleDoc, RoleModel>("Role", roleSchema);

export { Role, RoleProps, RoleModel, RoleDoc };
