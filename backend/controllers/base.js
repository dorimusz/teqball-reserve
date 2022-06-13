const Base = require("../models/base");
const AuthEntity = require("../models/user");

const initBaseData = async () => {
  const public = new Base({ name: "Public" });
  await public.save().catch((err) => console.log(err));
  const private = new Base({ name: "Private" });
  await private.save().catch((err) => console.log(err));
  return "base data added";
};

const initAuthEntity = async () => {
  const baseUser = new AuthEntity({
    username: "john_doe",
    email: "john@doe.com",
    password: "john_doe",
  });
  await baseUser.save().catch((err) => console.log(err));
  return "base user added";
};

exports.initBaseData = initBaseData;
exports.initAuthEntity = initAuthEntity;
