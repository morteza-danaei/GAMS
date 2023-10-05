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
    try {
      hashedPassword = await bcrypt.hash(password, saltRounds);
    } catch (err) {
      console.log(err);
    }
    return hashedPassword;
  }

  /**
   * A static  method that compared a password with a hshed text to see if they are the same.
 
   * @param storedPassword - The hashed version of password
   * @param suppliedPassword- The password 
   * @returns true if the storedPassword is the hashed version of suppliedPassword
   */
  static async compare(
    storedPassword: string,
    suppliedPassword: string
  ): Promise<boolean> {
    console.log(
      "existing pass:",
      storedPassword,
      "  suppliedPass:",
      suppliedPassword
    );
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
