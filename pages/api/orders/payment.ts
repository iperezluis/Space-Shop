import type { NextApiRequest, NextApiResponse } from "next";
import { URLSearchParams } from "url";
import axios from "axios";
import { IPayPal } from "../../../interfaces";
import Order from "../../../models/Order";
import { db } from "../../../database";
import { getSession } from "next-auth/react";
import { isValidObjectId } from "mongoose";
import nodemailer from "nodemailer";

type Data =
  | {
      message: string;
    }
  | IPayPal.OrderDetails;

export default function Payment(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return payOrder(req, res);

    default:
      return res.status(400).json({
        message: "Bad request",
      });
  }
}

const getPayPalBearerToken = async (): Promise<string | null> => {
  //these going into body
  const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET_ID;

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT}:${PAYPAL_SECRET}`,
    "utf-8"
  ).toString("base64");
  const body = new URLSearchParams();
  body.append("grant_type", "client_credentials");

  try {
    const { data } = await axios.post(
      process.env.PAYPAL_OAUTH_URL || "",
      body,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${base64Token}`,
        },
      }
    );
    console.log(data.access_token);
    return data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
    } else {
      console.log(error);
    }
    return null;
  }
};
const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  //to verify if user is athenticated
  const session: any = await getSession({ req });
  console.log({ session });
  if (!session) {
    return res.status(400).json({
      message: "Usuario no autenticado",
    });
  }

  const getBearerToken = await getPayPalBearerToken();
  if (!getBearerToken) {
    return res.status(400).json({
      message: "No se pudo generar el token de paypal",
    });
  }
  const { transactionId = "", orderId = "" } = req.body;

  //to verify if is a mongo id valid
  console.log({ orderId });
  if (!isValidObjectId(orderId)) {
    return res.status(400).json({
      message: "No es un id mongo valido",
    });
  }

  const { data } = await axios.get<IPayPal.OrderDetails>(
    `${process.env.PAYPAL_ORDERS_URL}/${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${getBearerToken}`,
      },
    }
  );

  //to verify that order is completed
  if (data.status !== "COMPLETED") {
    return res.status(400).json({
      message: "Orden no reconocida",
    });
  }
  //to verify if order exist
  await db.connect();
  const order = await Order.findById(orderId);
  if (!order) {
    await db.disconnect();
    return res.status(400).json({
      message: "Orden no existe",
    });
  }
  //to verify that amount does matching
  if (order.total !== Number(data.purchase_units[0].amount.value)) {
    return res.status(401).json({
      message: "Los montos de paypal y nuestra orden no son iguales",
    });
  }
  //to verify if this order belongs to user authenticated
  order.transactionId = transactionId;
  order.isPaid = true;
  await order.save();
  await db.disconnect();
  //TO DO send email to user and give it access to product or send product

  // async..await is not allowed in global scope, must use a wrapper
  const main = async () => {
    console.log();
    const date = new Date().toLocaleDateString();
    const hour = new Date().toLocaleTimeString();
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

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
    const { total, numberOfItems, transactionId } = order;
    const { name, email } = session.user;
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "Notificaciones Space-Shop <Luis@perezluisv.com>",
      to: email,
      subject: "🛍️ ¡Nueva compra en Space Shop!",
      text: "Compra exitosa",
      html: `<h1>¡Hola ${name}!</h1>
      <main>
      <p>El dia ${date} a las ${hour} realizaste una compra  por <b>$${
        total + ",00"
      }</b> en Space Shop por <b>${numberOfItems}</b> productos. Transaccion ID: <b>${transactionId}</b></p>
      </main>
       
      <footer>
      <b>Si no has realizado esta compra, contacta con nuestro equipo de soporte.</b>
      </footer>
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
    message: "orden pagada",
  });
};
