export const response201 = (res, data = null, message = "Resource created successfully") => {
    res.status(201).json({ 
        success: true,
        message,
        data 
    });
};

