const mongoose = require('mongoose');


const TaskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        course: { type: String, default: '', trim: true },
        type: { type: String, enum: ['Assignment', 'Exam'], default: 'Assignment' },
        due: { type: Date, default: null },
        done: { type: Boolean, default: false },
    },
    { timestamps: true }
);


// clean JSON output (id instead of _id)
TaskSchema.set('toJSON', {
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});


module.exports = mongoose.model('Task', TaskSchema);