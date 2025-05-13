import HttpStatus from 'http-status-codes';
import * as LoanService from '../services/loan.service';

export const getAllLoans = async (req, res, next) => {
  try {
    const data = await LoanService.getAllLoans();
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: 'All loans fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getLoan = async (req, res, next) => {
  try {
    const data = await LoanService.getLoan(req.params._id);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: 'Loan fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const newLoan = async (req, res, next) => {
  try {
    const data = await LoanService.newLoan(req.body);
    res.status(HttpStatus.CREATED).json({
      code: HttpStatus.CREATED,
      data: data,
      message: 'Loan created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const updateLoan = async (req, res, next) => {
  try {
    const data = await LoanService.updateLoan(req.params._id, req.body);
    res.status(HttpStatus.ACCEPTED).json({
      code: HttpStatus.ACCEPTED,
      data: data,
      message: 'Loan updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLoan = async (req, res, next) => {
  try {
    await LoanService.deleteLoan(req.params._id);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: [],
      message: 'Loan deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
