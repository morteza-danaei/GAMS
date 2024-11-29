export const cookieOptions = {
  signed: false, //process.env.NODE_ENV !== "test",
  // keys: [process.env.COOKIE_KEY1!, process.env.COOKIE_KEY2!],
  secure: process.env.NODE_ENV !== " test",
};
