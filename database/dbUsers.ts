import { db } from ".";
import User from "../models/User";
import bcrypt from "bcryptjs";

export const checkEmailPassword = async (email: String, password: string) => {
  await db.connect();
  const user = await User.findOne({ email }).lean();
  await db.disconnect();
  if (!user) {
    return null;
  }
  if (!bcrypt.compareSync(password, user.password!)) {
    return null;
  }
  const { _id, name, role } = user;
  return {
    _id,
    name,
    email: email.toLocaleLowerCase(),
    role,
  };
};
//search credentials of oAuth of network socials otherwise we create with them
export const oAuthToDB = async (oAuthEmail: string, oAuthName: string) => {
  await db.connect();
  const user = await User.findOne({ email: oAuthEmail });
  if (user) {
    await db.disconnect();
    const { _id, name, email, role } = user;
    return {
      _id,
      name,
      email,
      role,
    };
  }
  const newUser = new User({
    email: oAuthEmail,
    name: oAuthName,
    password: "@",
    role: "client",
  });
  await newUser.save();
  await db.disconnect();

  const { _id, name, email, role } = newUser;
  return {
    _id,
    name,
    email,
    role,
  };
};

export const getUserById = async (id: string) => {
  await db.connect();
  const user = await User.findById(id).lean();
  if (!user) {
    await db.disconnect();
    return null;
  }
  await db.disconnect();

  return JSON.parse(JSON.stringify(user));
};
