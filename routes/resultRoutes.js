import { submitExam, getExamResult } from '../controllers/resultController.js'
import express from 'express'
import { auth, restrictToExamParticipants} from '../middlewares/authMiddleware.js';

const router = express.Router(); 
 
router.post('/:examId',auth, submitExam);
router.get('/:examId',auth,restrictToExamParticipants, getExamResult);

export default router;