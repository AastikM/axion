const mongoose = require('mongoose')

const classroomSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Classroom name is required'],
			trim: true,
			maxlength: [100, 'Classroom name cannot exceed 100 characters'],
		},
		capacity: {
			type: Number,
			required: [true, 'Capacity is required'],
			min: [1, 'Capacity must be at least 1'],
			validate: {
				validator: Number.isInteger,
				message: 'Capacity must be an integer',
			},
		},
		resources: {
			type: [String],
			default: [],
			validate: {
				validator: resources => Array.isArray(resources),
				message: 'Resources must be an array of strings',
			},
		},
		school: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'School',
			required: [true, 'School reference is required'],
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
)

classroomSchema.index({ name: 1, school: 1 }, { unique: true })

const Classroom = mongoose.model('Classroom', classroomSchema)

module.exports = Classroom
