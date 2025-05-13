const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema(
  {
    applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bankId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    loanType: {
      type: String,
      enum: [
        'Personal Loan', 'Home Loan', 'Car Loan', 'Credit Card Loans', 'Business Loan',
        'Loan Against Property', '2 Wheeler Loan', 'Small Business Loan', 'Cash Credit',
        'Loan Against Securities', 'Salary Loan', 'Project Loan', 'Agriculture Loan',
        'Cash Advances', 'Gold Loan', 'Education Loan'
      ],
      required: true
    },
    amount: { type: Number, required: true },
    emiAmount: { type: Number },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    rejectReason: { type: String },
    documents: {
      photos: [String],
      panCard: String,
      aadhaar: String,
      incomeTaxReturns: String
    },
    createdAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Loan', loanSchema);
