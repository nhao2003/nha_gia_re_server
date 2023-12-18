const ServerCodes = {
    ValidationCode: 50,
    AuthCode: {
        Success: 100,
        InvalidCredentials: 101,
        UserNotFound: 102,
        EmailIsAlreadyExist: 103,
        UserNotActive: 104,
        UserNotUpdateProfile: 105,
        PasswordNotMatch: 106,
        PasswordIsSame: 107,
        PasswordIsIncorrect: 108,
        TokenIsExpired: 109,
    },
    PostCode: {
        Success: 200,
        PostNotFound: 201,
        PostNotUpdate: 202,
    },
    UserCode: {
        Success: 300,
        UserNotFound: 301,
        UserNotUpdate: 302,
    },
    AdminCode: {
        Success: 400,
        NotFound: 401,
        MissingRequiredFields: 402,
        PostAlreadyApproved: 403,
    },
};
export default ServerCodes;
