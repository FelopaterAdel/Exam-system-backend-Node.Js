import { createExam, getExams, getExamById ,deleteExam,editExam} from '../controllers/examController.js';
import express from 'express'
import { auth, restrictTo,restrictToExamParticipants} from '../middlewares/authMiddleware.js';

const router = express.Router(); 

router.post('/',auth,restrictTo('teacher'), createExam);
router.get('/',auth,restrictToExamParticipants, getExams);
router.get('/:id', getExamById);
router.put('/:id', editExam);
router.delete('/:id',deleteExam)
export default router;