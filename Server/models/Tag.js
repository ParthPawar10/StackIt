import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tag name is required'],
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: [20, 'Tag name cannot exceed 20 characters']
  },
  description: {
    type: String,
    maxlength: [200, 'Tag description cannot exceed 200 characters'],
    default: ''
  },
  color: {
    type: String,
    default: '#3b82f6'
  },
  questionCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Tag', tagSchema);
