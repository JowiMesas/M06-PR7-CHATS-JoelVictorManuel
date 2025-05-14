const BASE = 'http://localhost:4000/api/files';

export const fileService = {
  upload: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return fetch(`${BASE}/upload`, { method: 'POST', body: form })
      .then(r => r.json());
  },

  list: () =>
    fetch(`${BASE}/list`).then(r => r.json()),

  download: (filename: string) => {
    window.open(`${BASE}/download/${filename}`, '_blank');
  }
};