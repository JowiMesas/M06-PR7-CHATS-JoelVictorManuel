// Define la URL base para las llamadas a la API de archivos
const BASE = 'http://localhost:4000/api/files';

export const fileService = {
  /**
   * Sube un archivo al servidor
   * @param file - Objeto File que representa el archivo a subir
   * @returns Devuelve una Promise que, cuando se resuelve, contiene la respuesta del servidor tras la subida
   */
  upload: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return fetch(`${BASE}/upload`, { method: 'POST', body: form })
      .then(r => r.json());
  },

  /**
   * Obtiene la lista de archivos disponibles en el servidor
   * @returns Devuelve una Promise que, cuando se resuelve, contiene un array con la lista de archivos
   */
  list: () =>
    fetch(`${BASE}/list`).then(r => r.json()),

  /**
   * Descarga un archivo específico desde el servidor
   * @param filename - Nombre del archivo a descargar
   * @description Abre una nueva ventana del navegador para descargar el archivo
   */
  download: (filename: string) => {
    window.open(`${BASE}/download/${filename}`, '_blank');
  }
};