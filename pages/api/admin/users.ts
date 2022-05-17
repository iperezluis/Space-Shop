import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { User } from "../../../models";

import { isValidObjectId } from "mongoose";
import { IUser } from "../../../interfaces";

type Data =
  | {
      message: string;
    }
  | IUser[]
  | IUser;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getAllUser(req, res);
    case "PUT":
      return updateUser(req, res);
    case "DELETE":
      return deleteUser(req, res);

    default:
      return res.status(400).json({
        message: "End point no existe",
      });
  }
}
const getAllUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  const users = await User.find().select("-password").lean();
  await db.disconnect();

  return res.status(200).json(users);
};

const updateUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { id = "", role = "" } = req.body;
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message: "No es un id mongo valido",
    });
  }

  const validRoles = ["admin", "super-user", "SEO"];
  if (!validRoles.includes(role)) {
    return res.status(401).json({
      message: "Role no permitido" + validRoles.join(", "),
    });
  }

  await db.connect();
  const user = await User.findById(id);
  if (!user) {
    await db.disconnect();
    return res.status(400).json({
      message: "Usuario no existe",
    });
  }
  user.role = role;
  await user.save();
  await db.disconnect();

  return res.status(200).json(user);
};

const deleteUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { id = "" } = req.body;
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message: "No es un id mongo valido",
    });
  }

  await db.connect();
  const user = await User.findByIdAndDelete(id);
  await db.disconnect();

  return res.status(200).json({
    message: "user eliminado",
  });
};
