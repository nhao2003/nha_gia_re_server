export enum UserStatus {
  unverified = "unverified",
  not_update = "not_update",
  banned = "banned",
  deleted = "deleted",
  verified = "verified"
}

export enum Role {
  admin = "admin",
  staff = "staff",
  user = "user"
}

export enum OTPTypes {
  account_activation = "account_activation",
  password_recovery = "password_recovery"
}

export enum PostStatus {
  pending = "pending",
  approved = "approved",
  rejected = "rejected",
  hided = "hided"
}
export enum PropertyTypes {
  apartment = 'apartment',
  land = 'land',
  office = 'office',
  motel = 'motel',
  house = 'house',
}