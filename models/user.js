//User model for users
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  // For Patient Profile
  userName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  userType: { type: String},
  otp: { type: String },
  // For Doctor Profile
  doctorName: { type: String },
  doctorRegistrationNumber: { type: String },
  gender: { type: String },
  details: { type: String },
  specialization: { type: String },
  experienceInYears: { type: Number },//experience in years
  experience: [{ type: String }],
  qualification: [{ type: String }],
  clinicName: { type: String },
  address: { type: String },
  city: { type: String },
  startingTime: { type: String },
  endingTime: { type: String },
  slots: [{
    time: { type: String }, // e.g., '10:00 AM - 10:30 AM'
    available: { type: Boolean, default: true }, // Availability status
    occupied: { type: Boolean, default: false }, // Occupancy status
    patientName: { type: String },
    patientMail: { type: String },
  }],
  availableDays: [{ type: String }], //days of the week
  contactNumber: { type: String },
  achievements: [{ type: String}],
  awards: [{ type: String }],
  memberships: [{ type: String }],
  researches: [{ type: String }], //Research & publications
  languages: [{ type: String }],
  isVerified: { type: Boolean },
  isRegistered: { type: Boolean },
  todayNotAvailable: { type: Boolean, default: false },
  appointments: [{ type: String }], //Today's appointment
});

module.exports = mongoose.model('medicure_user', userSchema);