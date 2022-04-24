import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IUser } from "../../../interfaces";
import { User } from "../../../models";

import bcrypt from "bcryptjs";
import { jwt, validations } from "../../../utils";

type Data =
  | {
      message: string;
    }
  | { token: string; user: IUser };

export default function register(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return registerUser(req, res);

    default:
      return res.status(404).json({
        message: "EndPoint no existe",
      });
  }
}
const registerUser = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  let {
    name = "",
    email = "",
    password = "",
  } = req.body as { name: string; email: string; password: string };

  try {
    await db.connect();
    const mailUser = await User.findOne({ email }).lean();
    if (mailUser) {
      await db.disconnect();
      return res.status(500).json({
        message: "este email ya esta registrado",
      });
    }
    if (name.length < 2) {
      return res.status(400).json({
        message: "el nombre debe contener minimo 2 caracteres",
      });
    }
    if (!validations.isValidEmail(email)) {
      return res.status(400).json({
        message: "El valor insertado no es un correo valido",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "el password debe contener 6 caracteres",
      });
    }
    const user = new User({
      name: name.toLowerCase(),
      email: email.toLowerCase(),
      password: bcrypt.hashSync(password),
      role: "client",
    });
    await user.save({ validateBeforeSave: true });
    await db.disconnect();
    const token = await jwt.createJWT(user._id);

    res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "hubo un error en el servidor",
    });
  }
};
