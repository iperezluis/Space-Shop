import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IUser } from "../../../interfaces";
import { User } from "../../../models";
import { isValidObjectId } from "mongoose";

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
    case "POST":
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
    return res.status(400).json({
      message: "No es un id mongo valido",
    });
  }
  await db.connect();
  const user = await User.findById(id);
  if (!user) {
    return res.status(400).json({
      message: "No existe un usuario con ese id",
    });
  }
  (await user.image) != image;
  await user.save();
  await db.disconnect();

  res.status(200).json(user);
};
