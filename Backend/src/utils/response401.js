export const response401 = (res, message = "Unauthorized") => {
    res.status(401).json({ error: message });
};

