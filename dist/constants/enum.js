"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectStatus = exports.Progression = exports.ReportContentType = exports.ReportType = exports.ReportStatus = exports.MessageTypes = exports.LegalDocumentStatus = exports.Direction = exports.FurnitureStatus = exports.HouseTypes = exports.OfficeTypes = exports.LandTypes = exports.ApartmentTypes = exports.PropertyTypes = exports.PostStatus = exports.OTPTypes = exports.Role = exports.UserStatus = void 0;
var UserStatus;
(function (UserStatus) {
    UserStatus["unverified"] = "unverified";
    UserStatus["not_update"] = "not_update";
    UserStatus["banned"] = "banned";
    UserStatus["deleted"] = "deleted";
    UserStatus["verified"] = "verified";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var Role;
(function (Role) {
    Role["admin"] = "admin";
    Role["staff"] = "staff";
    Role["user"] = "user";
})(Role || (exports.Role = Role = {}));
var OTPTypes;
(function (OTPTypes) {
    OTPTypes["account_activation"] = "account_activation";
    OTPTypes["password_recovery"] = "password_recovery";
})(OTPTypes || (exports.OTPTypes = OTPTypes = {}));
var PostStatus;
(function (PostStatus) {
    PostStatus["pending"] = "pending";
    PostStatus["approved"] = "approved";
    PostStatus["rejected"] = "rejected";
    PostStatus["hided"] = "hided";
})(PostStatus || (exports.PostStatus = PostStatus = {}));
var PropertyTypes;
(function (PropertyTypes) {
    PropertyTypes["apartment"] = "apartment";
    PropertyTypes["land"] = "land";
    PropertyTypes["office"] = "office";
    PropertyTypes["motel"] = "motel";
    PropertyTypes["house"] = "house";
})(PropertyTypes || (exports.PropertyTypes = PropertyTypes = {}));
var ApartmentTypes;
(function (ApartmentTypes) {
    ApartmentTypes["apartment"] = "apartment";
    ApartmentTypes["duplex"] = "duplex";
    ApartmentTypes["officetel"] = "officetel";
    ApartmentTypes["service"] = "service";
    ApartmentTypes["dormitory"] = "dormitory";
    ApartmentTypes["penhouse"] = "penhouse";
})(ApartmentTypes || (exports.ApartmentTypes = ApartmentTypes = {}));
var LandTypes;
(function (LandTypes) {
    LandTypes["residential"] = "residential";
    LandTypes["commercial"] = "commercial";
    LandTypes["industrial"] = "industrial";
    LandTypes["agricultural"] = "agricultural";
})(LandTypes || (exports.LandTypes = LandTypes = {}));
var OfficeTypes;
(function (OfficeTypes) {
    OfficeTypes["office"] = "office";
    OfficeTypes["officetel"] = "officetel";
    OfficeTypes["shophouse"] = "shophouse";
    OfficeTypes["comercialspace"] = "comercialspace";
})(OfficeTypes || (exports.OfficeTypes = OfficeTypes = {}));
var HouseTypes;
(function (HouseTypes) {
    HouseTypes["townhouse"] = "townhouse";
    HouseTypes["villa"] = "villa";
    HouseTypes["alleyhouse"] = "alleyhouse";
    HouseTypes["frontagehouse"] = "frontagehouse";
})(HouseTypes || (exports.HouseTypes = HouseTypes = {}));
var FurnitureStatus;
(function (FurnitureStatus) {
    FurnitureStatus["empty"] = "empty";
    FurnitureStatus["basic"] = "basic";
    FurnitureStatus["full"] = "full";
    FurnitureStatus["high_end"] = "high_end";
})(FurnitureStatus || (exports.FurnitureStatus = FurnitureStatus = {}));
var Direction;
(function (Direction) {
    Direction["east"] = "east";
    Direction["west"] = "west";
    Direction["south"] = "south";
    Direction["north"] = "north";
    Direction["north_east"] = "north_east";
    Direction["north_west"] = "north_west";
    Direction["south_east"] = "south_east";
    Direction["south_west"] = "south_west";
})(Direction || (exports.Direction = Direction = {}));
var LegalDocumentStatus;
(function (LegalDocumentStatus) {
    LegalDocumentStatus["waiting_for_certificates"] = "waiting_for_certificates";
    LegalDocumentStatus["have_certificates"] = "have_certificates";
    LegalDocumentStatus["other_documents"] = "other_documents";
})(LegalDocumentStatus || (exports.LegalDocumentStatus = LegalDocumentStatus = {}));
var MessageTypes;
(function (MessageTypes) {
    MessageTypes["text"] = "text";
    MessageTypes["media"] = "media";
    MessageTypes["location"] = "location";
    MessageTypes["post"] = "post";
})(MessageTypes || (exports.MessageTypes = MessageTypes = {}));
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["pending"] = "pending";
    ReportStatus["resolved"] = "resolved";
    ReportStatus["rejected"] = "rejected";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
var ReportType;
(function (ReportType) {
    ReportType["user"] = "user";
    ReportType["post"] = "post";
    ReportType["conversation"] = "conversation";
})(ReportType || (exports.ReportType = ReportType = {}));
var ReportContentType;
(function (ReportContentType) {
    ReportContentType["spam"] = "spam";
    ReportContentType["offensive"] = "offensive";
    ReportContentType["inappropriate"] = "inappropriate";
    ReportContentType["other"] = "other";
})(ReportContentType || (exports.ReportContentType = ReportContentType = {}));
var Progression;
(function (Progression) {
    //Chưa khởi công
    Progression["not_start"] = "not_start";
    //Đang khởi công
    Progression["in_progress"] = "in_progress";
    //Đã hoàn thành
    Progression["completed"] = "completed";
})(Progression || (exports.Progression = Progression = {}));
var ProjectStatus;
(function (ProjectStatus) {
    //Sắp mở bán
    ProjectStatus["upcoming"] = "upcoming";
    //Đang mở bán
    ProjectStatus["opening"] = "opening";
    //Đã bàn giao
    ProjectStatus["delivered"] = "delivered";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
