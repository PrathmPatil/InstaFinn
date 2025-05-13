import express from 'express';
import * as loanController from '../controllers/loan.controller';
import { newLoanValidator } from '../validators/loan.validator';
import userAuth from '../middlewares/auth.middleware';

const loan_router = express.Router();

//route to get all users
loan_router.get('', loanController.getAllLoans);

//route to create a new loan
loan_router.post('', newLoanValidator, loanController.newLoan);

//route to get a single loan by their loan id
loan_router.get('/:_id', userAuth, loanController.getLoan);

//route to update a single loan by their loan id
loan_router.put('/:_id', loanController.updateLoan);

//route to delete a single loan by their loan id
loan_router.delete('/:_id', loanController.deleteLoan);

export default loan_router;
