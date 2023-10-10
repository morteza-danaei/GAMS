export const cookieOptions = {
  signed: process.env.NODE_ENV !== "test",
  keys: [process.env.COOKIE_KEY1!, process.env.COOKIE_KEY2!],
  secure: process.env.NODE_ENV !== "test",
  maxAge: 24 * 60 * 60 * 1000,
};
