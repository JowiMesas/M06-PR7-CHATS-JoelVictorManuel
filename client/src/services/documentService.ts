const BASE = 'http://localhost:4000/api';

let lastDocumentId = 1;

function generateNextId() {
  lastDocumentId += 1;
  return lastDocumentId.toString();
}

export const documentService = {
    listDocuments: () => {
        fetch(`${BASE}/list_docs`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }).then((res) => res.json)
    },

    createDocument: (titulo: string, salaId: string) => {
        const date = new Date().toISOString();
        const id = generateNextId();

        fetch(`${BASE}/create_doc`, {
            method: 'POST',
            headers: { "Content-Type":"application-json"},
            body: JSON.stringify({
                id: id,
                salaId: salaId,
                titulo,
                contenido: "",
                lastModified: date
            })
        })
    },
    openDoc: (id: string) => {
        fetch(`${BASE}/list_docs/${id}`, {
            method: 'GET',
            headers: { "Content-Type": "application-json" },
        }).then((res) => res.json)
    }
}