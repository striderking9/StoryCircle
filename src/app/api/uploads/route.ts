import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import path from "path";

// Désactiver le body parser par défaut de Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  // Utilisation d'une Promise pour intégrer le parsing asynchrone
  return new Promise((resolve, reject) => {
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Configurer formidable
    const form = formidable({
      multiples: false,
      uploadDir,
      keepExtensions: true,
    });

    // Convertir la requête en FormData
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("Erreur lors du parsing du fichier:", err);
        reject(
          NextResponse.json({ error: "Erreur lors de l'upload du fichier" }, { status: 500 })
        );
        return;
      }

      // Supposez que le champ file est nommé "upload"
      const file = files.upload as formidable.File;
      if (!file) {
        resolve(NextResponse.json({ error: "Aucun fichier uploadé" }, { status: 400 }));
        return;
      }

      // Construire l'URL publique du fichier
      const fileName = path.basename(file.filepath || file.path);
      const url = `${new URL(req.url).origin}/uploads/${fileName}`;

      resolve(NextResponse.json({ url }));
    });
  });
}
