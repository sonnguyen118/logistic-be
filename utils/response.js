const successResponse = (data, message) => {
  return {
    success: true,
    data,
    message
  };
};

const errorResponse = (message) => {
  return {
    success: false,
    message
  };
};

module.exports = { successResponse, errorResponse };
