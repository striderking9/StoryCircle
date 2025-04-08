"use client";

import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function MyEditor() {
  const [editorData, setEditorData] = useState("<p>Écrivez votre contenu ici...</p>");

  return (
    <div className="max-w-3xl mx-auto">
      <CKEditor
        editor={ ClassicEditor }
        data={ editorData }
        onChange={ ( event, editor ) => {
          const data = editor.getData();
          setEditorData(data);
        } }
        config={{
          // Vous pouvez configurer ici des plugins pour gérer l'upload d'image
          // Par exemple, "simpleUpload" pour un upload simple ou une configuration plus avancée.
          simpleUpload: {
            // URL de votre endpoint pour uploader les images
            uploadUrl: '/api/uploads',
            // Optionnel: headers, etc.
          }
        }}
      />
    </div>
  );
}
