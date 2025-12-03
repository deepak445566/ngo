// backend/controllers/volunteerController.js - UPDATED WITH CLOUDINARY
const Volunteer = require('../models/Volunteer');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// Create new volunteer with Cloudinary
exports.createVolunteer = async (req, res) => {
  try {
    const { name, aakNo, mobileNo, address } = req.body;
    
    console.log('Creating volunteer:', { name, aakNo, mobileNo, address });
    console.log('File received:', req.file ? 'Yes' : 'No');
    
    // Validate required fields
    if (!name || !aakNo || !mobileNo || !address) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if AAK number already exists
    const existingVolunteer = await Volunteer.findOne({ aakNo });
    if (existingVolunteer) {
      return res.status(400).json({
        success: false,
        message: 'AAK number already registered'
      });
    }

    // Generate unique ID
    const lastVolunteer = await Volunteer.findOne().sort('-uniqueId');
    const uniqueId = lastVolunteer ? lastVolunteer.uniqueId + 1 : 1;

    let imageUrl = '';
    
    // Handle image upload to Cloudinary
    if (req.file) {
      try {
        console.log('Uploading image to Cloudinary...');
        console.log('File details:', {
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size
        });

        // Upload to Cloudinary
        const result = await uploadToCloudinary(
          req.file.buffer, // File buffer
          `volunteer_${uniqueId}_${Date.now()}`
        );

        imageUrl = result.secure_url;
        console.log('Image uploaded to Cloudinary:', imageUrl);
      } catch (uploadError) {
        console.error('Cloudinary upload failed:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Image upload failed',
          error: uploadError.message
        });
      }
    }

    // Create volunteer
    const volunteer = new Volunteer({
      name,
      aakNo,
      mobileNo,
      address,
      imageUrl,
      uniqueId
    });

    await volunteer.save();

    console.log('Volunteer created successfully:', volunteer._id);

    res.status(201).json({
      success: true,
      message: 'Volunteer registered successfully',
      data: volunteer
    });

  } catch (error) {
    console.error('Error creating volunteer:', error);
    
    // Clean up uploaded image if volunteer creation failed
    if (imageUrl) {
      try {
        await deleteFromCloudinary(imageUrl);
      } catch (cleanupError) {
        console.error('Cleanup failed:', cleanupError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all volunteers
exports.getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: volunteers.length,
      data: volunteers
    });
  } catch (error) {
    console.error('Error getting volunteers:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get single volunteer
exports.getVolunteerById = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    
    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    res.json({
      success: true,
      data: volunteer
    });
  } catch (error) {
    console.error('Error getting volunteer:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete volunteer with Cloudinary cleanup
exports.deleteVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    
    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    // Delete image from Cloudinary if exists
    if (volunteer.imageUrl && volunteer.imageUrl.includes('cloudinary')) {
      try {
        await deleteFromCloudinary(volunteer.imageUrl);
        console.log('Image deleted from Cloudinary');
      } catch (deleteError) {
        console.error('Failed to delete image from Cloudinary:', deleteError);
      }
    }

    await volunteer.deleteOne();

    res.json({
      success: true,
      message: 'Volunteer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting volunteer:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Health check
exports.healthCheck = (req, res) => {
  res.json({
    success: true,
    message: 'Volunteer API is working',
    timestamp: new Date()
  });
};