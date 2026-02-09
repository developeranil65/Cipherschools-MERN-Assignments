import express from 'express';
import {
    getAllComplaints,
    createComplaint,
    getComplaintById,
    updateComplaintStatus,
    deleteComplaint,
    getComplaintStats
} from '../controllers/complaint.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', getAllComplaints);
router.get('/stats', getComplaintStats);
router.get('/:id', getComplaintById);
router.post('/', createComplaint);
router.put('/:id', authMiddleware, updateComplaintStatus);
router.delete('/:id', authMiddleware, deleteComplaint);

export default router;
