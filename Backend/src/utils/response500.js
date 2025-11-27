export const response500 = (res, message = "Internal server error") => {
    res.status(500).json({ error: message });
};

