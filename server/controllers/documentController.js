const fs   = require('fs');
const path = require('path');
const dbFile = path.join(__dirname,'../data/data.json');
function readDB(){return JSON.parse(fs.readFileSync(dbFile,'utf-8'));}
function writeDB(db){fs.writeFileSync(dbFile,JSON.stringify(db,null,2),'utf-8');}

exports.openDocument = (req,res)=>{
  const { docId } = req.params;
  const db = readDB();
  let doc = db.documentos.find(d=>d.id===docId);
  if(!doc){doc={id:docId,salaId:'s1',titulo:`Documento ${docId}`,contenido:'',lastModified:new Date().toISOString()};db.documentos.push(doc);writeDB(db);}
  res.json(doc);
};

exports.listDocuments = (req, res) => {
  const db = readDB();
  res.json(db.documentos);
};

exports.getDocument = (req, res) => {
  const db = readDB();
  const doc = db.documentos.find(d => d.id === req.params.id);
  if (!doc) return res.status(404).json({ error: 'No existe' });
  res.json(doc);
};

exports.createDocument = (req, res) => {
  const { titulo } = req.body;
  const db = readDB();
  const newDoc = {
    id: `d${db.documentos.length + 1}`,
    titulo: titulo || `Documento ${db.documentos.length + 1}`,
    contenido: '',
    lastModified: new Date().toISOString(),
  };
  db.documentos.push(newDoc);
  writeDB(db);
  res.status(201).json(newDoc);
};

exports.exportDocument=(req,res)=>{
  const { format,docId }=req.params;
  const db=readDB();const doc=db.documentos.find(d=>d.id===docId);
  if(!doc)return res.status(404).send('No existe');
  if(format==='txt'){res.setHeader('Content-Disposition',`attachment; filename=${doc.titulo}.txt`);return res.type('text/plain').send(doc.contenido);}
  if(format==='pdf'){res.setHeader('Content-Disposition',`attachment; filename=${doc.titulo}.pdf`);return res.type('application/pdf').send(Buffer.from(doc.contenido));}
  return res.status(400).send('Formato no');
};