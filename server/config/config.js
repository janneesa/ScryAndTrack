require("dotenv").config();

const PORT = process.env.PORT;
const MONGO =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGO
    : process.env.NODE_ENV === "development"
    ? process.env.LOCAL_MONGO
    : process.env.MONGO;

module.exports = {
  MONGO,
  PORT,
};
