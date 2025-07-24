/**
 * Async handler wrapper to catch async errors and pass them to error middleware
 * Eliminates the need for try-catch blocks in every async controller
 */
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};

export default asyncHandler;
