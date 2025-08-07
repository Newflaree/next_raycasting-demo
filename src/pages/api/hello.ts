// Ruta API en Next.js: /api/hello
// Documentación oficial: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";

// Tipo de datos que se devolverá
type Data = {
  message: string;
  name?: string;
  error?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    // Si la petición es GET, respondemos con un mensaje
    res.status(200).json({ message: "¡Bienvenido!", name: "John Doe" });
  } else if (req.method === "POST") {
    // Extraer datos del body
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ message: "Error", error: "Falta el nombre." });
      return;
    }

    res.status(200).json({ message: "Nombre recibido", name });
  } else {
    // Método no permitido
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ message: "Método no permitido", error: "Sólo GET y POST" });
  }
}
