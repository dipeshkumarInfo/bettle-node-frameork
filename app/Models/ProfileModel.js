const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const validateEmail = (email) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

function validateMobileNumber(number) {
    // Define a regular expression to match a 10-digit mobile number
    const regex = /^[0-9]{10}$/;
  
    // Check if the number matches the regular expression
    if (number && !regex.test(number)) {
      throw new Error('Invalid mobile number');
    }
  }

const ProfileSchema = new Schema({
    name: { type: String, required: true, trim: true, lowercase: true },
    email: { type: String, required: [true, "Email required"], unique: true,trim: true, lowercase: true, validate: [validateEmail, 'Please fill a valid email address'] },
    mobile_number: { type: String, validate: [validateMobileNumber, 'Invalid mobile number'] },
    photo: { type: String },
    description: { type: String },
    dob: { type: String, trim: true, lowercase: true },
    status: { type: Number, default:1 },
}, { timestamps: true });

module.exports = mongoose.model('profiles', ProfileSchema);