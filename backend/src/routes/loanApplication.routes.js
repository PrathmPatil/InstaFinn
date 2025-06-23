// src/routes/loanApplication.routes.js
import express from 'express';
import {
    createLoanApplication,
    getAllLoanApplications,
    getLoanApplicationById,
    updateLoanApplication,
    deleteLoanApplication,
    getLoanApplicationsByUserId,
    getLoanApplicationsByAgentId,
    createLoanApplicationDocuments
} from '../controllers/loanApplication.controller';
import { authMiddleware, hasRole } from '../middlewares/auth.middleware'; // Import your auth middleware
import { transformLoanApplicationPayload, validateCreateLoanApplication, validateCreateLoanApplicationDocuments, validateUpdateLoanApplication } from '../middlewares/validation.middleware'; // Import validation middleware
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure storage
// Define the upload directory
const uploadDir = 'public/uploads/';

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // recursive: true creates parent directories if needed
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });
const router = express.Router();


// Routes
router.post('/', authMiddleware,transformLoanApplicationPayload, validateCreateLoanApplication, createLoanApplication); // User, Agent, SubAgent
router.post('/upload/:id', authMiddleware,upload.array('documents'), validateCreateLoanApplicationDocuments, createLoanApplicationDocuments);
router.get('/', authMiddleware, hasRole(['masterAdmin', 'admin', 'bankOperator,agent']), getAllLoanApplications); // Admin, Bank Operator
router.get('/:id', authMiddleware, getLoanApplicationById); // All authenticated users
// router.put('/:id', authMiddleware, validateUpdateLoanApplication, updateLoanApplication); // User, Agent, SubAgent
router.put('/:id', authMiddleware, updateLoanApplication);
router.delete('/:id', authMiddleware, deleteLoanApplication); // User, Agent, SubAgent
router.get('/user', authMiddleware, hasRole(['user']), getLoanApplicationsByUserId); // User
router.get('/:role/:id', authMiddleware, hasRole(['masterAdmin','agent', 'subAgent', 'bankOperator', 'admin','user']), getLoanApplicationsByAgentId); // Agent, SubAgent

export default router;
