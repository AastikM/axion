const mongoose = require('mongoose')

const schoolSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'School name is required'],
			trim: true,
			maxlength: [100, 'School name cannot exceed 100 characters'],
		},
		address: {
			type: String,
			required: [true, 'School address is required'],
			trim: true,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'Created by field is required'],
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
)

schoolSchema.index({ name: 1 })

const School = mongoose.model('School', schoolSchema)

module.exports = School
