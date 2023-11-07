import mongoose from "mongoose";

// An interface that describes the properties
// that are requried to create a new personnel
interface PrsnlProps {
  nid: string;
  pid: string;
  name: string;
  lastname: string;
  department: string;
}

// An interface that describes the properties
// that a personnel Document has
interface PrsnlDoc extends mongoose.Document {
  //National ID
  nid: string;

  //personnel Id
  pid: string;
  name: string;
  lastname: string;
  department: string;
}

// An interface that describes the properties
// that a personnel Model has
interface PrsnlModel extends mongoose.Model<PrsnlDoc> {
  /**
   *{@link Personnel.(build:static) | the build() static method that creates a personnel}
   *
   */
  build(props: PrsnlProps): PrsnlDoc;
}

const prsnlSchema = new mongoose.Schema(
  {
    //National ID
    nid: {
      type: "string",
      required: true,
    },

    //Personnel ID
    pid: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    department: {
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
 * A static factory method of Personnel model that creates a new Personnel.

 * @param props - The properties of the personnel object to be created
 * @returns a Personnel instance with properties equal to props
 */
prsnlSchema.statics.build = (props: PrsnlProps) => {
  return new Personnel(props);
};

const Personnel = mongoose.model<PrsnlDoc, PrsnlModel>(
  "Personnel",
  prsnlSchema
);

export { Personnel, PrsnlProps, PrsnlModel, PrsnlDoc };
