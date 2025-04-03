import React, { useState, useEffect } from 'react';
import { getImages, uploadImage } from '../services/api';
import ImageCard from './ImageCard';

const ImageGallery = ({ refreshTrigger }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar imágenes al montar el componente o cuando se actualiza refreshTrigger
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getImages();
        if (data && data.result && Array.isArray(data.result)) {
          setImages(data.result);
        } else {
          setImages([]);
          setError('No se pudieron cargar las imágenes.');
        }
      } catch (err) {
        setError('Hubo un problema al cargar las imágenes.');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [refreshTrigger]);

  // Función para manejar la subida de imágenes con animación
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true); // Inicia la animación de carga

    try {
      const response = await uploadImage(file);
      setImages((prevImages) => [response, ...prevImages]); // Agrega la nueva imagen al principio
    } catch (err) {
      console.error('Error al subir imagen:', err);
      setError('No se pudo subir la imagen.');
    } finally {
      setUploading(false); // Finaliza la animación de carga
    }
  };

  return (
    <div className="gallery-container">
      <h2>Galería de imágenes ({images.length})</h2>

      <input 
        type="file" 
        accept="image/*" 
        onChange={handleUpload} 
        disabled={uploading} 
        className="upload-input"
      />

      {uploading && (
        <div className="uploading">
          <div className="spinner"></div> Subiendo imagen...
        </div>
      )}

      {loading && <div className="loading">🔄 Cargando imágenes...</div>}
      {error && <div className="error">❌ {error}</div>}

      <div className="image-grid">
        {images.map((image, index) => (
          <ImageCard key={image.id || index} image={image} />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
