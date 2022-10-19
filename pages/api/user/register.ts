import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IUser } from "../../../interfaces";
import { User } from "../../../models";

import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
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
      image: "",
      role: "client",
    });
    await user.save({ validateBeforeSave: true });
    await db.disconnect();
    const token = await jwt.createJWT(user._id);
    //send mail notification nodemailer

    const { name: username, email: emailer } = user;
    const main = async () => {
      console.log();
      // Generate test SMTP service account from ethereal.email
      // Only needed if you don't have a real mail account for testing
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        // host: "smtp.example.com",
        host: process.env.HOST_ZONE,
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_ID, // generated credentials SMTP user
          pass: process.env.SMTP_PASSWORD, //generated credentials SMTP password
        },
      });
      // verify connection configuration
      transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log("Server is ready to take our messages");
        }
      });
      // const session: any = await getSession({ req });
      // const { name, email } = user;
      // send mail with defined transport object

      let info = await transporter.sendMail({
        from: "Notificaciones Space-Shop <Luis@perezluisv.com>",
        to: emailer,
        subject: `👋🏽 ${username}, ¡Te damos la Bienvenida a Space Shop!`,
        text: "Registor exitoso",
        html: `<h1>¡Hola ${username}!</h1>
      <main>
     <p>¡Bienvenido a Space Shop! Somos una plataforma internacional y virtual donde el valor del dinero siempre se mantiene. Junto a nosotros podrás realizar tus compras de forma ágil y segura, sin descuidar tu bienestar, el de tu familia y el de tu bolsillo.</p>

    <p>Te dejamos tu información de contacto</>
<hr/>

<hr/>

<b>Nombre Completo:</b>
${username}

<hr/>

<b>Usuario:</b>
<a>${emailer}</a>

<hr/>

<p>¡Gracias por ser parte de la comunidad Space shop!</p>

<p>Estaremos siempre listos para apoyarte en lo que necesites.
Sin prejuicios, somos Space Shop tu tienda online favorita.</p>

<hr/>
      </main>
       
      `,
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    };

    main().catch(console.error);

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
