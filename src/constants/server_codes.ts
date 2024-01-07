const ServerCodes = {
  CommomCode: {
    Success: 0,
    Error: 1,
    NotFound: 2,
    MissingRequiredFields: 3,
    FieldValidationFailed: 4,
    InvalidQueryOperator: 5,
    InternalServerError: 6,
    InvalidUUID: 7,
    BadRequest: 8,
    QueryFailed: 9,
    Forbiden: 10,
    InvalidField: 11,
    Unauthorized: 12,
  },
  ValidationCode: 50,
  AuthCode: {
    PaswordIsIncorrect: 100,
    InvalidCredentials: 101,
    UserNotFound: 102,
    EmailAlreadyExsist: 103,
    PasswordIsInvalid: 104,
    UserNotActive: 104,
    UserNotUpdateProfile: 105,
    EmailOrPasswordIsIncorrect: 106,
    OTPCodeIsIncorrectOrExpired: 107,
    UserIsAlreadyActive: 108,
    UserHasBeenBaned: 109,
    UserIsNotBaned: 110,
    TokenIsExpired: 111,
    TokenIsInvalid: 112,
    TokenIsMissing: 113,
    UserIsNotVerified: 114,
    AccessTokenIsRequired: 115,
  },
  PostCode: {
    Success: 200,
    PostNotFound: 201,
    PostNotUpdate: 202,
    ExceededNumberOfPostsInMonth: 203,
  },
  UserCode: {
    Success: 300,
    UserNotFound: 301,
    UserNotUpdate: 302,
    UserAlreadyVerified: 303,
  },
  AdminCode: {
    Success: 400,
    NotFound: 401,
    MissingRequiredFields: 402,
    PostAlreadyApproved: 403,
  },
  DiscountCode: {
    CodeAlreadyExists: 500,
  },
  ConversationCode: {
    CanNotChatWithYourself: 600,
  },
  MembershipPackageCode: {
    UserHasSubscription: 700,
  },
};
export default ServerCodes;
