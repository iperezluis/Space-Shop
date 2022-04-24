import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    default:
      return res
        .status(404)
        .json({ message: "Debe espiocificar el parametro de busqueda" });
  }
}
