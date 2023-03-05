const successResponse = (data, message) => {
    return {
      success: true,
      data,
      message
    };
  };
  
  const errorResponse = (message, statusCode) => {
    return {
      success: false,
      message,
      statusCode
    };
  };
  
  module.exports = { successResponse, errorResponse };
  