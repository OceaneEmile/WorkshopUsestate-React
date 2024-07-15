"use client";
import { useState } from "react";
import { ImageGenerator } from "./ImageGenerator";

export default function Home() {

  const [image, setImage] = useState(null);

  const [settings, setSettings] = useState({
    padding: 16, // ce sont les valeurs par défaut
    shadow: 10,
    radius: 16,
  });
  // Méthode pour modifier les paramètres
  const setSetting = (name, value) => {
    setSettings((curr) => ({
      ...curr,
      [name]: value, // il faut utiliser la syntaxe array pour pouvoir modifier les valeurs
    }));
  };
  // Méthode pour gérer l'upload d'image
  const handleImageUpload = (event) => {
    // const file = event.target.files[0];
    // setImage(URL.createObjectURL(file));
    // console.log(file);
    const files = event.target.files;
    const file = files[0];
    console.log(file);

    const reader = new FileReader();

    reader.onload = function () {
      const img = new Image();

      img.onload = function () {
        setImage({
          width: img.width,
          height : img.height,
          src: img.src,
          name: file.name,
        });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };
//console.log(image);
console.log(settings);

  return (
    <main className="flex justify-center items-center m-auto max-w-4xl max-lg:flex-col gap-8 min-h-full">
      <div className="card bg-base-100 image-full w-96 shadow-xl">
      <figure>
          {ImageGenerator({ image, settings })}
        </figure>
        <div className="card-body">
          <div className="card-actions justify-end">
          </div>
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
          onChange={(e) => setSetting("padding", Number (e.target.value))} // on change la valeur de padding : onChange={(e) => setSetting("key", e.target.value)}
          className="range range-accent"
        />
        <span>Shadow</span>
        <input
          type="range"
          min="0"
          max="100"
           value={settings.shadow}
           onChange={(e) => setSetting("shadow", e.target.value)}
          className="range range-accent"
        />
        <span>Radius</span>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.radius}
          onChange={(e) => setSetting("radius", e.target.value)}
          className="range range-accent"
        />
      </div>
    </main>
  );
}
