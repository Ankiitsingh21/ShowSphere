import mongoose from "mongoose";
import { Password } from "../services/password";

/*
  Imagine we are building a school registration system.

  Before we allow someone to become a student,
  we must know what information is required.

  TypeScript helps us define strict rules.
  Mongoose helps us talk to the database.
*/

/*
  🟢 1. UserAttrs

  This tells us:
  "What do we need to create a NEW user?"

  Think of it like a registration form.

  If someone forgets to write their email or password,
  we should not allow them to register.

  So this interface says:
  You MUST give:
    - email
    - password
*/
interface UserAttrs {
  email: string;
  password: string;
  // id:string
}

/*
  🔵 2. UserDoc

  This describes what a user looks like
  AFTER it has been saved in the database.

  When MongoDB stores something,
  it automatically adds extra things like:
    - _id
    - built-in document features

  So we extend mongoose.Document
  to include those built-in database powers.
*/
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  id: string;
}

interface idd {
  id: string;
}

/*
  🟣 3. UserModel

  Now this is interesting.

  This describes the "User machine".

  The model can:
    - create users
    - find users
    - delete users

  But we also want a SPECIAL function called "build".

  Why?

  Because we want TypeScript to check:
  "Are you giving the correct information when creating a user?"

  This makes our system safer.
*/
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

/*
  🏗️ 4. The Schema

  This tells MongoDB how a user should be stored.

  It's like telling the database:
  "Each user must have:
      - email (String)
      - password (String)
   And both are required."
*/
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
    toJSON: {
      transform(doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  },
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  // done();
});

/*
  🧠 5. The build() Method

  Instead of writing:
      new User({ email, password })

  We create a cleaner and safer method:
      User.build({ email, password })

  Why is this cool?

  Because now TypeScript checks:
  - Did you forget password?
  - Did you mistype a field?
  - Are you sending wrong data?

  If something is wrong,
  TypeScript will complain BEFORE the app runs.
*/
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

/*
  🔗 6. Connecting Everything

  mongoose.model<DocumentType, ModelType>

  - UserDoc tells TypeScript what a saved user looks like.
  - UserModel tells TypeScript what functions exist on the model.

  Now everything is strongly typed and safe.
*/
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

/*
  📦 7. Export

  Now other files can import this model
  and safely create or fetch users.
*/
export { User };
