module.exports = class Express_error extends Error {
    message:string;
    statusCode: string;
    constructor(message:string,statusCode:string) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
};