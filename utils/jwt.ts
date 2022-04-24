import jwt from "jsonwebtoken";

export const createJWT = (id: string): Promise<string> => {
  if (!process.env.SECRET_KEY_JWT) {
    throw new Error("No hay semilla de  JWT revisar variables de entorno");
  }
  return new Promise((resolve, reject) => {
    const payload = { id };
    jwt.sign(
      payload,
      process.env.SECRET_KEY_JWT!,
      {
        expiresIn: "15 days",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se puedo generar el JWT");
        } else {
          resolve(token!);
        }
      }
    );
  });
};
export const verifyJWT = (token: string): Promise<string> => {
  if (!process.env.SECRET_KEY_JWT) {
    throw new Error("No hay semilla de  JWT revisar variables de entorno");
  }
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.SECRET_KEY_JWT!, (err, payload) => {
        if (err) {
          console.log(err);
          return reject("JWT no es valido");
        }
        const { id } = payload as { id: string };
        console.log({ payload });
        return resolve(id);
      });
    } catch (error) {
      console.log(error);
      reject("JWT no es valido");
    }
  });
};
