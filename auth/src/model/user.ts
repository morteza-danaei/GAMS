import mongoose from "mongoose";
import bcrypt from "bcrypt";

// An interface that describes the properties
// that are requried to create a new User
interface UserProps {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  /**
   *{@link User.(build:static) | the build() static method that creates a user}
   *
   */
  build(props: UserProps): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // The following code is used to change _id prop in document
    // to id
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

//A mongoose pre middleware to hash password before
//saving to db
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const saltRounds = 10;
    const password = this.get("password");
    let hashedPassword;
    await bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        hashedPassword = hash;
      });
    });
    // Store hash in your password DB.
    this.set("password", hashedPassword);
  }
  done();
});

/**
 * A static factory method of User model that creates a new user.

 * @param props - The properties of the user object to be created
 * @returns a User instance with properties equal to props
 */
userSchema.statics.build = (props: UserProps) => {
  return new User(props);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
