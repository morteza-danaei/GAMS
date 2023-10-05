interface signupUser {
  username: string;
  password: string;
  repeat_password: string;
  email: string;
}
const validSignupUser: signupUser = {
  username: "d38240undfl",
  password: "fsdfsadfasd1",
  repeat_password: "fsdfsadfasd1",
  email: "a@dd.com",
};

interface SigninUser {
  username: string;
  password: string;
}
const validSigninUser: SigninUser = {
  username: "d38240undfl",
  password: "fsdfsadfasd1",
};

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
