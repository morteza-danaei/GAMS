/**
 * An interface that represents a user object for signing up.
 */
interface signupUser {
  username: string;
  password: string;
  repeat_password: string;
  email: string;
}
const validSignupUser: signupUser = {
  username: "d38240undhhhfl",
  password: "Aa!328794skhdnf",
  repeat_password: "Aa!328794skhdnf",
  email: "a@daad.com",
};

interface SigninUser {
  username: string;
  password: string;
}
const validSigninUser: SigninUser = {
  username: "d38240undhhhfl",
  password: "Aa!328794skhdnf",
};

/**
 * Returns the modified version of an object by adding a property to it.
 *
 * @param object - The original object
 * @param propertyName - The additional property name(key)in string
 * @param newValue - The value of the additional property
 * @returns the modified object with an  additional property
 */
function changePropertyValue<T extends Object, K extends keyof T>(
  object: T,
  propertyName: K,
  newValue: any
): T {
  const newObject = Object.assign({}, object);
  newObject[propertyName] = newValue;
  return newObject;
}

export { validSigninUser, validSignupUser, changePropertyValue };
