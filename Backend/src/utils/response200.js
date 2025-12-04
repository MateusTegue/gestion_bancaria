export const response200 = (res, data = null, message = "Success") => {
    res.status(200).json({ 
        success: true,
        data,
        message
    });
};

