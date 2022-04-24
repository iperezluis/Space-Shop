import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { User } from "../../../models";

import bcrypt from "bcryptjs";
import { IUser } from "../../../interfaces";
import { jwt } from "../../../utils";

type Data =
  | {
      message: string;
    }
  | {
      newtoken: string;
      user: IUser;
    };

export default function login(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "GET":
      return checkJWT(req, res);

    default:
      return res.status(404).json({
        message: "EndPoint no existe",
      });
  }
}
const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { token = "" } = req.cookies;
  let userId = "";
  try {
    userId = await jwt.verifyJWT(token);
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "Token de autorizacion no es valido",
    });
  }
  await db.connect();
  const user = await User.findById(userId).lean();
  await db.disconnect();
  if (!user) {
    return res.status(400).json({
      userId,
      message: "No existe un usuario con ese id",
    } as any);
  }
  const newtoken = await jwt.createJWT(user._id);

  res.status(200).json({
    newtoken,
    user,
  });
};
