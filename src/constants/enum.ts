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

export enum ApartmentTypes {
  apartment = 'apartment',
  duplex = 'duplex',
  officetel = 'officetel',
  service = 'service',
  dormitory = 'dormitory',
  penhouse = 'penhouse',
}

export enum LandTypes {
  residential = 'residential',
  commercial = 'commercial',
  industrial = 'industrial',
  agricultural = 'agricultural',
}

export enum OfficeTypes {
  office = 'office',
  officetel = 'officetel',
  shophouse = 'shophouse',
  comercialspace = 'comercialspace',
}

export enum HouseTypes {
  townhouse = 'townhouse',
  villa = 'villa',
  alleyhouse = 'alleyhouse',
  frontagehouse = 'frontagehouse',
}

export enum FurnitureStatus {
  empty = 'empty',
  basic = 'basic',
  full = 'full',
  high_end = 'high_end',
}

export enum Direction {
  east = 'east',
  west = 'west',
  south = 'south',
  north = 'north',
  north_east = 'north_east',
  north_west = 'north_west',
  south_east = 'south_east',
  south_west = 'south_west',
}

export enum LegalDocumentStatus {
  waiting_for_certificates = 'waiting_for_certificates',
  have_certificates = 'have_certificates',
  other_documents = 'other_documents',
}

export enum MessageTypes {
  text = 'text',
  media = 'media',
  location = 'location',
  post = 'post',
}

export enum ReportStatus {
  pending = 'pending',
  resolved ='resolved',
  rejected = 'rejected'
}


export enum ReportType {
  user = 'user',
  post = 'post',
  conversation = 'conversation',
}


export enum ReportContentType {
  spam = 'spam',
  offensive = 'offensive',
  inappropriate = 'inappropriate',
  other = 'other',
}

export enum Progression {
  //Chưa khởi công
  not_start = 'not_start',
  //Đang khởi công
  in_progress = 'in_progress',
  //Đã hoàn thành
  completed = 'completed',
}

export enum ProjectStatus {
  //Sắp mở bán
  upcoming = 'upcoming',
  //Đang mở bán
  opening = 'opening',
  //Đã bàn giao
  delivered = 'delivered',
}

export enum TransactionStatus {
  unpaid = 'unpaid',
  paid = 'paid',
}

export enum NotificationType {
  'info',
  'warning',
  'error',
  'message',
}