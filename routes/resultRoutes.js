import { submitExam, getExamResult } from '../controllers/resultController.js'
import express from 'express'
import { auth, restrictToExamParticipants} from '../middlewares/authMiddleware.js';

const router = express.Router(); 
 
router.post('/:examId', submitExam);
router.get('/:examId', getExamResult);

export default router;