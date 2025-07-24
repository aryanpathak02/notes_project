import ApiError from '../utils/ApiError.js';

/**
 * Global error handling middleware
 * Catches all errors and sends consistent error responses
 */
const errorHandler = (err, req, res, next) => {
    let error = err;

    // If error is not an instance of ApiError, create one
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Something went wrong";
        error = new ApiError(statusCode, message, [], err.stack);
    }

    const response = {
        success: false,
        message: error.message,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack })
    };

    res.status(error.statusCode).json(response);
};

export default errorHandler;
