const express = require('express');
const School = require('../models/School');
const { authenticate, authorize } = require('../middlewares/auth');
const router = express.Router();

// Create a new school (Superadmin only)
router.post('/', authenticate, authorize(['Superadmin']), async (req, res) => {
    try {
      const { name, address } = req.body;
  
      // Create a new school, using the current user (Superadmin) as the creator
      const newSchool = new School({
        name,
        address,
        createdBy: req.user.id,  // Attach the Superadmin's ObjectId
      });
  
      await newSchool.save();
      res.status(201).json(newSchool);
    } catch (err) {
      res.status(500).json({ message: 'Failed to create school', error: err.message });
    }
  });

  // GET all schools (Superadmin only)
router.get('/', authenticate, authorize(['Superadmin']), async (req, res) => {
    try {
      const schools = await School.find(); // Fetch all schools
      res.status(200).json(schools);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch schools', error: err.message });
    }
  });
  
  // GET a single school by ID (Superadmin only)
  router.get('/:id', authenticate, authorize(['Superadmin']), async (req, res) => {
    try {
      const school = await School.findById(req.params.id); // Fetch school by ID
      if (!school) return res.status(404).json({ message: 'School not found' });
      res.status(200).json(school);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch school', error: err.message });
    }
  });

  // UPDATE a school by ID (Superadmin only)
router.put('/:id', authenticate, authorize(['Superadmin']), async (req, res) => {
    try {
      const { name, address } = req.body;
  
      // Find school by ID and update its details
      const updatedSchool = await School.findByIdAndUpdate(
        req.params.id, // School ID
        { name, address }, // Fields to update
        { new: true, runValidators: true } // Return updated document and apply schema validation
      );
  
      if (!updatedSchool) {
        return res.status(404).json({ message: 'School not found' });
      }
  
      res.status(200).json(updatedSchool); // Send updated school
    } catch (err) {
      res.status(500).json({ message: 'Failed to update school', error: err.message });
    }
  });

  // DELETE a school by ID (Superadmin only)
router.delete('/:id', authenticate, authorize(['Superadmin']), async (req, res) => {
    try {
      const deletedSchool = await School.findByIdAndDelete(req.params.id);
  
      if (!deletedSchool) {
        return res.status(404).json({ message: 'School not found' });
      }
  
      res.status(200).json({ message: 'School deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete school', error: err.message });
    }
  });

module.exports = router;