import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config(process.env.CLOUDINARY_URL || "");
//le decimos a next quie no parsee los files que estoy esperando
export const config = {
  api: {
    bodyParser: false,
  },
};

type Data = {
  message: string;
};
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return uploadFile(req, res);

    default:
      return res.status(400).json({
        message: "Bad request",
      });
  }
}
const saveFile = async (file: formidable.File): Promise<string> => {
  //en este punto ya existe la carpeta fisica en el fileSystem
  // const data = fs.readFileSync(file.filepath);
  // // ahora hagamos la escritura y movimiento de ese archivo a una carpeta fisica
  // fs.writeFileSync(`./public/${file.originalFilename}`, data);
  // //ahora eliminamos para que no acumule archivos basura
  // fs.unlinkSync(file.filepath);
  // return;
  //subimos la imagen que esta en nuesra carpeta temporal
  const { secure_url } = await cloudinary.uploader.upload(file.filepath);
  return secure_url;
};
//el formidable qiue instalamos lo usamos aqui abajo para parsear los files antes de subir a cloudinary o almacenar en fileSYstem(no recomendado por next);
const parseFiles = (req: NextApiRequest): Promise<string> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      console.log(err, fields, files);

      if (err) {
        return reject(err);
      }
      //aqui ya tenemos el secure_url que retornamos
      const filePath = await saveFile(files.file as formidable.File);
      console.log({ filePath });
      resolve(filePath);
    });
  });
};

const uploadFile = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const imageUrl = await parseFiles(req);
  return res.status(200).json({
    message: imageUrl,
  });
};
