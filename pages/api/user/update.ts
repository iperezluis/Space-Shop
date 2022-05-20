import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { User } from "../../../models";
import { isValidObjectId } from "mongoose";
import { IUser } from "../../../interfaces/user";

type Data =
  | {
      message: string;
    }
  | IUser;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "PUT":
      return updateImageUser(req, res);

    default:
      res.status(400).json({
        message: "Bad request",
      });
  }
}
const updateImageUser = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { image = "", id = "" } = req.body;
  if (!isValidObjectId(id)) {
    await db.disconnect();
    return res.status(400).json({
      message: "No es un id mongo valido",
    });
  }
  await db.connect();
  const user = await User.findById(id);
  if (!user) {
    await db.disconnect();
    return res.status(400).json({
      message: "No existe un usuario con ese id",
    });
  }
  user.image = image;
  await user.save();
  await db.disconnect();

  console.log(user);
  res.status(200).json(user);
};
