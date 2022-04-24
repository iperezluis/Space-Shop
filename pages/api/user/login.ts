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
      token: string;
      user: IUser;
    };

export default function login(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "POST":
      return loginUser(req, res);

    default:
      return res.status(404).json({
        message: "EndPoint no existe",
      });
  }
}
const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { email = "", password = "" } = req.body;
  // email.toLowerCase();
  try {
    await db.connect();
    //si quieres usar la ultima fecha del logueo del usuario entonces quita el lean o trae la fecha con el select y ya
    const user = await User.findOne({ email }).lean();
    await db.disconnect();
    if (!user) {
      return res.status(404).json({
        message: "email o correo no existen - email",
      });
    }
    if (!bcrypt.compareSync(password, user.password!)) {
      return res.status(500).json({
        message: "contraseña o email incorrectos -password",
      });
    }
    const token = await jwt.createJWT(user._id);

    // const { name, email, rol } = user;
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
