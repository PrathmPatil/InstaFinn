// src/controllers/loanApplication.controller.js
import {
    createLoanApplication as createLoanApplicationService,
    getAllLoanApplications as getAllLoanApplicationsService,
    getLoanApplicationById as getLoanApplicationByIdService,
    updateLoanApplication as updateLoanApplicationService,
    deleteLoanApplication as deleteLoanApplicationService,
    getLoanApplicationsByUserId as getLoanApplicationsByUserIdService,
    getLoanApplicationsByAgentId as getLoanApplicationsByAgentIdService,
    createLoanApplicationDocuments as createLoanApplicationDocumentService
} from '../services/loanApplication.service';
// Create a new loan application
export const createLoanApplication = async (req, res) => {
  try {
    // Convert string dates to Date objects
    if (req.body.personalInfo?.applicantDob) {
      req.body.personalInfo.applicantDob = new Date(req.body.personalInfo.applicantDob);
    }
    
    if (req.body.familyInfo?.spouseDOB) {
      req.body.familyInfo.spouseDOB = new Date(req.body.familyInfo.spouseDOB);
    }
    
    if (req.body.familyInfo?.fatherDOB) {
      req.body.familyInfo.fatherDOB = new Date(req.body.familyInfo.fatherDOB);
    }
    
    if (req.body.familyInfo?.motherDOB) {
      req.body.familyInfo.motherDOB = new Date(req.body.familyInfo.motherDOB);
    }

    const application = await createLoanApplicationService(req.body, req.user.id);
    // const savedApplication = await application.save();
    
    res.status(201).json({
      message: "Loan application created successfully",
      data: application
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error creating loan application",
      error: error.message 
    });
  }
}
export const createLoanApplicationDocuments = async (req, res) => {
    try {
        const authenticatedUser = req.user;
        const applicationId = req.params.id;
        const files = req.files; // This comes from multer middleware
        
        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        // Process uploaded files
        const documents = files.map(file => ({
            name: file.originalname,
            url: `/uploads/${file.filename}`, // Adjust based on your storage
            type: file.fieldname // This should match your form field names
        }));

        const savedApplication = await createLoanApplicationDocumentService(
            { applicationId, documents },
            authenticatedUser._id
        );
        
        res.status(201).json({
            message: "Loan application files uploaded successfully",
            data: savedApplication
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get all loan applications
export const getAllLoanApplications = async (req, res) => {
    try {
        const applications = await getAllLoanApplicationsService();
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get loan application by ID
export const getLoanApplicationById = async (req, res) => {
    try {
        const application = await getLoanApplicationByIdService(req.params.id);
        res.status(200).json(application);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Update loan application by ID
export const updateLoanApplication = async (req, res) => {
    try {
        console.log(req.body,req.params);
        const { id } = req.params;
        const updateData = req.body;
        const role = req.user.role;
        const userId = req.user.id;
        const updatedApplication = await updateLoanApplicationService(id, updateData, role, userId);
        res.status(200).json(updatedApplication);
    } catch (error) {
        res.status(400).json({ message: error.message }); //  400 for bad request
    }
};

// Delete loan application by ID
export const deleteLoanApplication = async (req, res) => {
    try {
        const role = req.user.role;
        const userId = req.user.id;
        const result = await deleteLoanApplicationService(req.params.id, role, userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 for bad request
    }
};

// Get loan applications by User ID
export const getLoanApplicationsByUserId = async (req, res) => {
    try {
        const userId = req.user.id;
        const applications = await getLoanApplicationsByUserIdService(userId);
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get loan applications by Agent ID
export const getLoanApplicationsByAgentId = async (req, res) => {
    try {
        const agentId = req.user._id;
        const agentRole=req.user.role
        const applications = await getLoanApplicationsByAgentIdService(agentRole,agentId);
        res.status(200).json({message:"Loan applications retrieved successfully",data:applications});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
