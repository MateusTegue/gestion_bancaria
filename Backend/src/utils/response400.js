export const response400 = (res, message = "Bad request") => {
    res.status(400).json({ error: message });
};

