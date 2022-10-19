import { db } from ".";
import User from "../models/User";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

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
    const { _id, name, email, image, role } = user;
    return {
      _id,
      name,
      email,
      image,
      role,
    };
  }
  // if user doesn't exist
  const newUser = new User({
    email: oAuthEmail,
    name: oAuthName,
    password: "@",
    image: "",
    role: "client",
  });
  await newUser.save();
  await db.disconnect();
  console.log(newUser);
  const { _id, name, email, image, role } = newUser;
  //Send mailer for user authenticated by Social networks
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

    let info = await transporter.sendMail({
      from: "Notificaciones Space-Shop <Luis@perezluisv.com>",
      to: email,
      subject: `👋🏽 ${name}, ¡Te damos la Bienvenida a Space Shop!`,
      text: "Registor exitoso",
      html: `<h1>¡Hola ${name}!</h1>
        <main>
       <p>¡Bienvenido a Space Shop! Somos una plataforma internacional y virtual donde el valor del dinero siempre se mantiene. Junto a nosotros podrás realizar tus compras de forma ágil y segura, sin descuidar tu bienestar, el de tu familia y el de tu bolsillo.</p>
  
      <p>Te dejamos tu información de contacto</>
  <hr/>
  
  <hr/>
  
  <b>Nombre Completo:</b>
  ${name}
  
  <hr/>
  
  <b>Usuario:</b>
  <a>${email}</a>
  
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

  return {
    _id,
    name,
    email,
    image,
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
