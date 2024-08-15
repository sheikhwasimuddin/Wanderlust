class ExpressError extends Error{
    constructor(message, statusCode){
        super();
        this.status = statusCode;
        this.message=message;
        }
}

module.exports=ExpressError;