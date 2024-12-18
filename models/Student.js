const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, 'First name is required'],
			trim: true,
			maxlength: [50, 'First name cannot exceed 50 characters'],
		},
		lastName: {
			type: String,
			required: [true, 'Last name is required'],
			trim: true,
			maxlength: [50, 'Last name cannot exceed 50 characters'],
		},
		age: {
			type: Number,
			required: [true, 'Age is required'],
			min: [3, 'Age must be at least 3'],
			max: [18, 'Age must not exceed 18'],
		},
		enrolled: {
			type: Date,
			default: Date.now,
		},
		school: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'School',
			required: [true, 'School reference is required'],
		},
		classroom: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Classroom',
			default: null,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
)

studentSchema.index({ lastName: 1, school: 1 })

const Student = mongoose.model('Student', studentSchema)

module.exports = Student
