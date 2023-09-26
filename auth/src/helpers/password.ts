import bcrypt from "bcrypt";

export class Password {
  /**
  * A static  method that get a password in plain and returns hashed version.
 
  * @param password - The plain password
  * @returns hashed password
  */
  static async toHash(password: string) {
    const saltRounds = 10;
    let hashedPassword;
    await bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        hashedPassword = hash;
      });
    });
    return hashedPassword;
  }

  /**
   * A static  method that compared a password with a hshed text to see if they are the same.
 
   * @param storedPassword - The hashed version of password
   * @param suppliedPassword- The password 
   * @returns true if the storedPassword is the hashed version of suppliedPassword
   */
  static async compare(storedPassword: string, suppliedPassword: string) {
    bcrypt.compare(suppliedPassword, storedPassword, function (err, result) {
      if (err) {
        return console.log(err);
      }
      return result;
    });
  }
}
