import bcrypt from "bcrypt";

export class Password {
  /**
  * Returns the hashed version of a given password.
 
  * @param password - The plain password
  * @returns hashed password
  */
  static async toHash(password: string) {
    const saltRounds = 10;
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, saltRounds);
    } catch (err) {
      console.log(err);
    }
    return hashedPassword;
  }

  /**
   * compares a password  with a hashed text to see if they are the same.
 
   * @param storedPassword - The hashed version of password
   * @param suppliedPassword- The password 
   * @returns true if the storedPassword is the hashed version of suppliedPassword
   */
  static async compare(
    storedPassword: string,
    suppliedPassword: string
  ): Promise<boolean> {
    let finalResult: boolean = false;
    try {
      finalResult = await bcrypt.compare(suppliedPassword, storedPassword);
    } catch (error) {
      // TODO: Define an error class for this type of error
      console.log(error);
    }
    return finalResult;
  }
}
