"use client";
import { useState } from "react";
import { ImageGenerator } from "./ImageGenerator";
import { renderPNG } from "./render-png";
import Link from "next/link";

export default function Home() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState("idle");

  const [settings, setSettings] = useState({
    padding: 16, // ce sont les valeurs par défaut
    shadow: 10,
    radius: 16,
  });

  // Méthode pour désactiver le bouton download si telechargement en cours
  const handleDownload = async (isCopying) => {
    setLoading(isCopying ? "copying" : "downloading");
    const { blob } = await renderPNG({
      image,
      settings,
    });
    const url = URL.createObjectURL(blob);

    if (isCopying) {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ]);
        alert("Image copiée dans le presse-papiers !");
      } catch (err) {
        console.error("Échec de la copie de l'image : ", err);
        alert("La copie de l'image a échoué.");
      }
    } else {
      const link = document.createElement("a");
      link.download = image.name.replace(/\.(jpg|jpeg|png)$/i, "-elevation.png");
      link.href = url;
      document.body.appendChild(link); // Ajout temporaire à l'élément body
      link.click();
      document.body.removeChild(link); // Suppression après le clic
      URL.revokeObjectURL(url); // Libération de l'URL
    }
    setLoading("idle");
  }

  // Méthode pour modifier les paramètres
  const setSetting = (name, value) => {
    setSettings((curr) => ({
      ...curr,
      [name]: value, // il faut utiliser la syntaxe array pour pouvoir modifier les valeurs
    }));
  };

  // Méthode pour gérer l'upload d'image
  const handleImageUpload = (event) => {
    const files = event.target.files;
    const file = files[0];

    // Vérification du type de fichier avec message d'erreur
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      alert("Veuillez choisir une image au format JPEG ou PNG");
      return;
    }

    const reader = new FileReader();

    reader.onload = function () {
      const img = new Image();

      img.onload = function () {
        setImage({
          width: img.width,
          height: img.height,
          src: img.src,
          name: file.name,
        });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className="flex justify-center items-center m-auto max-w-4xl max-lg:flex-col gap-8 min-h-full">
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="w-full h-fit border rounded-md">
          <ImageGenerator settings={settings} image={image} />
        </div>
      </div>
      <div className="card-body">
        <span>Files</span>
        <input
          type="file"
          className="file-input file-input-bordered file-input-accent w-full max-w-xs"
          onChange={handleImageUpload}
        />
        <span>Padding</span>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.padding}
          onChange={(e) => setSetting("padding", Number(e.target.value))} // on change la valeur de padding : onChange={(e) => setSetting("key", e.target.value)}
          className="range range-accent"
        />
        <span>Shadow</span>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.shadow}
          onChange={(e) => setSetting("shadow", Number(e.target.value))}
          className="range range-accent"
        />
        <span>Radius</span>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.radius}
          onChange={(e) => setSetting("radius", Number(e.target.value))}
          className="range range-accent"
        />
      </div>
      <button
        className="btn"
        onClick={() => handleDownload(false)}
        disabled={loading !== "idle"}
      >
        Download {loading === "downloading" ? "..." : ""}
      </button>
      <button
        className="btn-primary"
        onClick={() => handleDownload(true)}
        disabled={loading !== "idle"}
      >
        Copy {loading === "copying" ? "..." : ""}
      </button>
    </main>
  );
}
