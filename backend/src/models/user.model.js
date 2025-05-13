import { Schema, model } from 'mongoose';

const userSchema = new Schema(
 {
  role: {
    type: String,
    enum: ['superadmin', 'admin', 'bank', 'applicant', 'lender'] ,
    required: true
  },
  personalInfo: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    pin: { type: String },
    email: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Transgender'] },
    dob: { type: Date },
    nationality: { type: String }
  },
  familyDetails: {
    maritalStatus: { type: String, enum: ['Married', 'Unmarried'] },
    spouse: { name: String, dob: Date },
    mother: { name: String, dob: Date },
    father: { name: String, dob: Date },
    nomineeName: { type: String },
    childrenCount: { type: Number, min: 0 }
  },
  incomeDetails: {
    type: { type: String, enum: ['Salary', 'Business'] },
    employerOrBusinessName: { type: String },
    address: { type: String },
    workEmail: { type: String }
  },
  borrowing: {
    loanType: { type: String },
    amount: { type: Number },
    emiAmount: { type: Number }
  },
  investments: {
    investmentType: { type: String },
    currentAmount: { type: Number }
  },
  creditScore: {
    score: { type: Number },
    report: { type: String }
  },
  documents: {
    photos: [String],
    panCard: String,
    aadhaar: String,
    incomeTaxReturns: String
  },
  lenderDetails: {
    bankName: { type: String },
    branch: { type: String },
    keyPerson: {
      name: { type: String },
      address: { type: String },
      email: { type: String },
      designation: { type: String },
      employeeId: { type: String }
    }
  },
  businessName: { type: String }
},
  {
    timestamps: true
  }
);

export default model('User', userSchema);

