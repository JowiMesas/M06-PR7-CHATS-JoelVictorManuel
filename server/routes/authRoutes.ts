import express from 'express';
import authController from '../controllers/authController';  // Asegúrate de que la importación sea correcta

const router = express.Router();

// Ruta POST para login
router.post('/login', authController);

export default router;