export const response404 = (res, message = "Resource not found") => {
    res.status(404).json({ error: message });
};