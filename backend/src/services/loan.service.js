import Loan from "../models/Loan.model";

//get all users
export const getAllLoans = async () => {
  const data = await Loan.find();
  return data;
};

//create new Loan
export const newLoan = async (body) => {
  const data = await Loan.create(body);
  return data;
};

//update single Loan
export const updateLoan = async (_id, body) => {
  const data = await Loan.findByIdAndUpdate(
    {
      _id
    },
    body,
    {
      new: true
    }
  );
  return data;
};

//delete single Loan
export const deleteLoan = async (id) => {
  await Loan.findByIdAndDelete(id);
  return '';
};

//get single Loan
export const getLoan = async (id) => {
  const data = await Loan.findById(id);
  return data;
};
