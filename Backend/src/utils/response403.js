export const response403 = (res, message = "Forbidden") => {
    res.status(403).json({ error: message });
};

