
const express = require('express');
const Classroom = require('../models/Classroom');
const { authenticate, authorize } = require('../middlewares/auth');
const router = express.Router();

router.post('/', authenticate, authorize(['Superadmin', 'SchoolAdmin']), async (req, res) => {
  try {
    const { name, capacity, resources, schoolId } = req.body;

    const classroom = new Classroom({
      name,
      capacity,
      resources,
      school: schoolId, 
    });

    await classroom.save();
    res.status(201).json({status: 201, classroom});
  } catch (err) {
    res.status(500).json({status: 500, message: 'Failed to create classroom', error: err.message });
  }
});

router.get('/:schoolId', authenticate, authorize(['Superadmin', 'SchoolAdmin']), async (req, res) => {
    try {
    const classrooms = await Classroom.find({ school: req.params.schoolId });
    res.status(200).json({status: 200, classrooms});
  } catch (err) {
    res.status(500).json({status: 500, message: 'Failed to fetch classrooms', error: err.message });
  }
});


router.get('/:id', authenticate, authorize(['Superadmin', 'SchoolAdmin']), async (req, res) => {
    try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) return res.status(404).json({ status: 404, message: 'Classroom not found' });
    res.status(200).json({status: 200, classroom});
  } catch (err) {
    res.status(500).json({status: 500, message: 'Failed to fetch classroom', error: err.message });
  }
});

router.put('/:id', authenticate, authorize(['Superadmin', 'SchoolAdmin']), async (req, res) => {
    try {
      const { name, capacity, resources } = req.body;
  
      const updatedClassroom = await Classroom.findByIdAndUpdate(
        req.params.id, 
        { name, capacity, resources },
        { new: true, runValidators: true } 
      );
  
      if (!updatedClassroom) {
        return res.status(404).json({status: 404, message: 'Classroom not found' });
      }
  
      res.status(200).json({status: 200, updatedClassroom});
    } catch (err) {
      res.status(500).json({status: 500, message: 'Failed to update classroom', error: err.message });
    }
  });


router.delete('/:id', authenticate, authorize(['Superadmin', 'SchoolAdmin']), async (req, res) => {
    try {
      const deletedClassroom = await Classroom.findByIdAndDelete(req.params.id);
  
      if (!deletedClassroom) {
        return res.status(404).json({status:404,  message: 'Classroom not found' });
      }
  
      res.status(200).json({ status:200, message: 'Classroom deleted successfully' });
    } catch (err) {
      res.status(500).json({status: 500, message: 'Failed to delete classroom', error: err.message });
    }
  });

module.exports = router;
