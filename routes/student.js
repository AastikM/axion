const express = require('express');
const Student = require('../models/Student');
const { body, validationResult } = require('express-validator');
const { authenticate, authorize } = require('../middlewares/auth');
const router = express.Router();

router.post(
    '/',
    authenticate, 
    authorize(['SchoolAdmin', 'Superadmin']), 
    [
      body('firstName').isString().notEmpty().withMessage('First name is required'),
      body('lastName').isString().notEmpty().withMessage('Last name is required'),
      body('age').isInt({ min: 5, max: 18 }).withMessage('Age must be between 5 and 18'),
      body('schoolId').isMongoId().withMessage('Valid schoolId is required'),
      body('classroomId').isMongoId().withMessage('Valid classroomId is required'),
    ],
    (req, res) => {
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({status: 400, errors: errors.array() });
      }
  
      const { firstName, lastName, age, schoolId, classroomId } = req.body;
      const student = new Student({
        firstName,
        lastName,
        age,
        school: schoolId,
        classroom: classroomId,
      });
  
      student.save()
        .then(result => res.status(201).json({status: 201, result}))
        .catch(err => res.status(500).json({status: 500, message: 'Failed to enroll student', error: err.message }));
    }
  );

router.get('/:schoolId', authenticate, authorize(['Superadmin','SchoolAdmin']), async (req, res) => {
  try {
    const students = await Student.find({ school: req.params.schoolId }).populate('school');
    res.status(200).json({status: 200, students});
  } catch (err) {
    res.status(500).json({status: 500, message: 'Failed to fetch students', error: err.message });
  }
});

router.put(
  '/:id',
  authenticate, 
  authorize(['SchoolAdmin', 'Superadmin']), 
  [
    body('firstName').optional().isString().notEmpty().withMessage('First name must be a valid string'),
    body('lastName').optional().isString().notEmpty().withMessage('Last name must be a valid string'),
    body('age').optional().isInt({ min: 5, max: 18 }).withMessage('Age must be between 5 and 18'),
    body('classroomId').optional().isMongoId().withMessage('Valid classroomId is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({status: 400, errors: errors.array() });
    }

    const updates = req.body;
    const studentId = req.params.id;

    try {
      const updatedStudent = await Student.findByIdAndUpdate(studentId, updates, {
        new: true,
        runValidators: true, 
      });

      if (!updatedStudent) {
        return res.status(404).json({status: 404, message: 'Student not found' });
      }

      res.status(200).json({status: 200, updatedStudent});
    } catch (err) {
      res.status(500).json({status: 500, message: 'Failed to update student', error: err.message });
    }
  }
);


router.delete('/:id', authenticate, authorize(['SchoolAdmin', 'Superadmin']), async (req, res) => {
  const studentId = req.params.id;

  try {
    const deletedStudent = await Student.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return res.status(404).json({status: 404, message: 'Student not found' });
    }

    res.status(200).json({status: 200, message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({status: 500, message: 'Failed to delete student', error: err.message });
  }
});

module.exports = router;