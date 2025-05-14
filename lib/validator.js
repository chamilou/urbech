// lib/validators.js

/**
 * Validates partner configuration data
 * @param {object} data - The configuration data to validate
 * @returns {object} - { valid: boolean, errors?: object }
 */
// lib/validator.js
export const validatePartnerConfig = (data) => {
    const errors = {};
    
    // Required fields
    if (!data.name?.trim()) errors.name = "Partner name is required";
    if (!data.type?.trim()) errors.type = "Partner type is required";
    if (!data.headerTitle?.trim()) errors.headerTitle = "Header title is required";
    if (!data.bankDetails?.trim()) errors.bankDetails = "Bank details are required";
    if (!data.contactInfo?.trim()) errors.contactInfo = "Contact info is required";
  
    // Length checks
    if (data.name?.length > 100) errors.name = "Must be ≤100 characters";
    if (data.type?.length > 110) errors.type = "Must be ≤50 characters";
    if (data.headerTitle?.length > 100) errors.headerTitle = "Must be ≤100 characters";
    if (data.footerNote?.length > 200) errors.footerNote = "Must be ≤200 characters";
    if (data.bankDetails?.length > 500) errors.bankDetails = "Must be ≤500 characters";
    if (data.contactInfo?.length > 500) errors.contactInfo = "Must be ≤500 characters";
  
    return {
      valid: Object.keys(errors).length === 0,
      errors: Object.keys(errors).length > 0 ? errors : undefined
    };
  };
  
  /**
   * Sanitizes partner configuration data
   * @param {object} data - The data to sanitize 
   * @returns {object} - Sanitized data
   */
 // lib/validator.js
export const sanitizePartnerConfig = (data) => {
    return {
      name: data.name?.trim() || "",
      type: data.type?.trim() || "",
      headerTitle: data.headerTitle?.trim() || "",
      footerNote: data.footerNote?.trim() || "",
      bankDetails: data.bankDetails?.trim() || "",
      contactInfo: data.contactInfo?.trim() || ""
    };
  };