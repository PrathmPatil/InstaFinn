// Assuming multer is set up
import cloudinary from 'cloudinary';
// src/services/loanApplication.service.js
import LoanApplication from '../models/loanApplication.model';
import LoanCriteria  from '../models/loanCriteria.model'; // Import LoanCriteria
import User from '../models/user.model'; // Import User\
import Branch from '../models/branch.model'
import { application } from 'express';

// export const createLoanApplication = async (applicationData, userId) => {
//     try {
//         const agentId = applicationData.agentId;
//         const bankId = applicationData.bankId;
//         console.log(applicationData,userId)
//         // Optional: Validate branch if branchId is provided
//         if (applicationData.branchId && applicationData.bankId) {
//             const branch = await Branch.findById(applicationData.branchId);
//             console.log(branch)
//             if (!branch) {
//                 throw new Error('Branch not found');
//             }
//             if (branch.bankId.toString() !== applicationData.bankId) {
//                 throw new Error('Branch does not belong to the specified bank');
//             }
//         }

//         // Validate criteria values
//         const criteria = await LoanCriteria.find({
//             bankId: applicationData.bankId,
//             // Optional: Include branchId if relevant
//             ...(applicationData.branchId && { branchId: applicationData.branchId })
//         });
//         console.log(criteria,applicationData.criteriaValues)

//         if (criteria.length !== applicationData.criteriaValues.length) {
//             throw new Error('Add remaining criteria also.');
//         }

//         // for (const criteriaValue of applicationData.criteriaValues) {
//         //     const matchingCriteria = criteria.filter(c => c._id.toString() === criteriaValue.criteriaId)[0];
//         //     if (!matchingCriteria) {
//         //         throw new Error('Invalid criteria ID: ' + criteriaValue.criteriaId);
//         //     }
//         //     console.log(matchingCriteria)

//         //     // Perform type and range validation (as in your original code)
//         //     const value = criteriaValue.value;
//         //     switch (matchingCriteria.dataType) {
//         //         case 'number':
//         //             if (typeof value !== 'number') throw new Error(`Invalid type for ${matchingCriteria.criteriaName}.`);
//         //             if (matchingCriteria.minValue !== undefined && value < matchingCriteria.minValue) throw new Error(`${matchingCriteria.criteriaName} below min.`);
//         //             if (matchingCriteria.maxValue !== undefined && value > matchingCriteria.maxValue) throw new Error(`${matchingCriteria.criteriaName} above max.`);
//         //             break;
//         //         case 'string':
//         //             if (typeof value !== 'string') throw new Error(`Invalid type for ${matchingCriteria.criteriaName}.`);
//         //             break;
//         //         case 'date':
//         //             if (!(value instanceof Date)) throw new Error(`Invalid type for ${matchingCriteria.criteriaName}.`);
//         //             break;
//         //         case 'boolean':
//         //             if (typeof value !== 'boolean') throw new Error(`Invalid type for ${matchingCriteria.criteriaName}.`);
//         //             break;
//         //         default:
//         //             throw new Error(`Invalid data type for ${matchingCriteria.criteriaName}.`);
//         //     }
//         // }

//         // Create the loan application
//         const newApplication = new LoanApplication({
//             ...applicationData,
//             userId: userId,
//             agentId: agentId,
//             bankId: bankId
//         });
//         const savedApplication = await newApplication.save();

//         // Populate the created application
//         const populatedApplication = await LoanApplication.findById(savedApplication._id)
//             .populate('userId', 'id')
//             .populate('agentId', 'id')
//             .populate('bankId', 'name')
//             .populate('branchId', 'name location')
//             .populate('criteriaValues.criteriaId', 'criteriaName');

//         return populatedApplication;
//     } catch (error) {
//         throw new Error('Error creating loan application: ' + error.message);
//     }
// };

export const createLoanApplication = async (applicationData, id) => {
  console.log(applicationData, id);
  try {
    const application = await LoanApplication.create(applicationData);
    console.log(application);

    let newApplication = {};
    newApplication["status"] = application?.status;
    newApplication["_id"] = application?._id;
    newApplication["userId"] = application?.userId;
    newApplication["personalInfo"] = application?.personalInfo;
    newApplication["familyInfo"] = application?.familyInfo;
    newApplication["employmentInfo"] = application?.employmentInfo;
    newApplication["loanDetails"] = application?.loanDetails;
    newApplication["creditScore"] = application?.creditScore;
    newApplication["agentId"] = id;

    return newApplication;
  } catch (error) {
    return error.message;
  }
};


// In your service file:
export const createLoanApplicationDocument = async (applicationData, userId) => {
  try {
    const application = await LoanApplication.findByIdAndUpdate(
      applicationData.applicationId,
      { $push: { documents: applicationData.documents } },
      { new: true }
    );
    return application;
  } catch (error) {
    throw new Error(error.message);
  }
}
export const uploadDocuments = async (req, res) => {
  try {
    const { applicationId } = req.params;

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'No files were uploaded.' });
    }

    const uploadedDocs = [];

    for (const key in req.files) {
      const fileArray = Array.isArray(req.files[key]) ? req.files[key] : [req.files[key]];
      
      for (const file of fileArray) {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: `loan_documents/${applicationId}`
        });

        uploadedDocs.push({
          name: key,
          url: result.secure_url,
          type: result.resource_type
        });
      }
    }

    const updatedApp = await LoanApplication.findByIdAndUpdate(
      applicationId,
      { $push: { documents: { $each: uploadedDocs } } },
      { new: true }
    );

    res.status(200).json({ message: 'Documents uploaded', updatedApp });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const uploadLoanApplicationFiles = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const uploadedFiles = [];

    for (const field of ['photo', 'aadharcard', 'pancard', 'incomeTaxReturn', 'creditReport']) {
      if (req.files?.[field]) {
        const files = Array.isArray(req.files[field]) ? req.files[field] : [req.files[field]];

        for (const file of files) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: `loan_applications/${applicationId}/${field}`
          });

          uploadedFiles.push({
            name: field,
            url: result.secure_url,
            type: file.mimetype
          });
        }
      }
    }

    await LoanApplication.findByIdAndUpdate(applicationId, {
      $push: { documents: { $each: uploadedFiles } }
    });

    res.status(200).json({ message: 'Files uploaded', uploaded: uploadedFiles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });
  }
};


// Get all loan applications
export const  getAllLoanApplications= async () => {
    try {
        const applications = await LoanApplication.find()
            // .populate('userId', 'id')
            // .populate('agentId', 'id')
            // .populate('bankId', 'name')
            // .populate('branchId', 'name location')
            // .populate('criteriaValues.criteriaId', 'criteriaName');
        return applications;
    } catch (error) {
        throw new Error('Error fetching loan applications: ' + error.message);
    }
};

// Get loan application by ID
export const getLoanApplicationById = async (id) => {
    try {
        const application = await LoanApplication.findById(id)
            // .populate('userId', 'id')
            // .populate('agentId', 'id')
            // .populate('bankId', 'name')
            // .populate('branchId', 'name location')
            // .populate('criteriaValues.criteriaId', 'criteriaName');
        if (!application) {
            throw new Error('Loan application not found');
        }
        return application;
    } catch (error) {
        throw new Error('Error fetching loan application: ' + error.message);
    }
};

// Update loan application by ID
export const updateLoanApplication = async (id, updateData, role, userId) => {
    try {
        const application = await LoanApplication.findById(id);
        if (!application) {
            throw new Error('Loan application not found');
        }

        // Authorization checks
        if (role === 'user' && application.userId.toString() !== userId) {
            throw new Error('Unauthorized: You can only update your own loan applications.');
        }
        if (role === 'agent' || role === 'subAgent') {
            if (application.agentId && application.agentId.toString() !== userId) {
                throw new Error("Unauthorized: You can only update loan applications that you submitted")
            }
        }

        // Prevent certain updates based on status
        if (application.status === 'approved') {
            throw new Error('Cannot update an approved loan application.');
        }
        if (application.status === 'rejected' && updateData.status !== 'resubmitted') {
            throw new Error('Only status resubmitted allowed after rejection');
        }

        const updatedApplication = await LoanApplication.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        })
            .populate('userId', 'id')
            .populate('agentId', 'id')
            .populate('bankId', 'name')
            .populate('branchId', 'name location')
            .populate('criteriaValues.criteriaId', 'criteriaName');

        return updatedApplication;
    } catch (error) {
        throw new Error('Error updating loan application: ' + error.message);
    }
};

// Delete loan application by ID
export const deleteLoanApplication = async (id, role, userId) => {
    try {
        const application = await LoanApplication.findById(id);
        if (!application) {
            throw new Error('Loan application not found');
        }
        //  Authorization check.
        if (role === 'user' && application.userId.toString() !== userId) {
            throw new Error('Unauthorized: You can only delete your own loan applications.');
        }
        if (role === 'agent' || role === 'subAgent') {
            if (application.agentId && application.agentId.toString() !== userId) {
                throw new Error("Unauthorized: You can only delete loan applications that you submitted")
            }
        }

        // Prevent deletion if it is not pending
        if (application.status !== 'pending' && application.status !== 'resubmitted') {
            throw new Error('Cannot delete loan application with status: ' + application.status);
        }

        const deletedApplication = await LoanApplication.findByIdAndDelete(id);
        if (!deletedApplication) {
            throw new Error('Loan application not found'); // Redundant, but kept for consistency
        }
        return { message: 'Loan application deleted successfully' };
    } catch (error) {
        throw new Error('Error deleting loan application: ' + error.message);
    }
};

// Get loan applications by User ID
export const getLoanApplicationsByUserId = async (userId) => {
    try {
        const applications = await LoanApplication.find({ userId: userId })
            .populate('userId', 'id')
            .populate('agentId', 'id')
            .populate('bankId', 'name')
            .populate('branchId', 'name location')
            .populate('criteriaValues.criteriaId', 'criteriaName');
        return applications;
    } catch (error) {
        throw new Error('Error fetching loan applications: ' + error.message);
    }
};

// Get loan applications by Agent ID
export const getLoanApplicationsByAgentId = async (agentRole,agentId) => {
    try {
        const allSubAgents=await User.find({createdBy:agentId});
        let subAgentIds=[];
        if(allSubAgents.length>0){
            allSubAgents?.forEach((subAgent)=>{
                subAgentIds.push(subAgent._id);
            })
        }
        subAgentIds.push(agentId);
        console.log(subAgentIds);
        const applications = await LoanApplication.find({ agentId: {$in:subAgentIds} })
            .populate('userId', 'id')
            .populate('agentId', 'id')
            .populate('bankId', 'name')
            .populate('branchId', 'name location')
            .populate('criteriaValues.criteriaId', 'criteriaName');
        // const applications = await LoanApplication.find({ agentId: agentId })
        //     .populate('userId', 'id')
        //     .populate('agentId', 'id')
        //     .populate('bankId', 'name')
        //     .populate('branchId', 'name location')
        //     .populate('criteriaValues.criteriaId', 'criteriaName');
        const loanApplication =await LoanApplication.find()
        return {applications, loanApplication};
    } catch (error) {
        console.log(agentId)
        throw new Error('Error fetching loan applications: ' + error.message);
    }
};