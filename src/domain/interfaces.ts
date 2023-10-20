interface Blog {
  id: string;
  title: string;
  short_description: string;
  author: string;
  thumbnail: string;
  content_link: string;
  is_active: boolean;
  created_at: Date;
}

interface Comment {
  id: string;
  parent_id: string | null;
  blog_id: string;
  user_id: string;
  reply_to_user_id: string | null;
  comment: string;
  timestamp: Date;
  is_active: boolean;
}

interface Conversation {
  id: string;
  created_at: Date;
  last_messsage_id: string;
  is_active: boolean;
}

interface Developer {
  id: string;
  description: string;
  images: string[];
  created_at: Date;
  is_active: boolean;
  name: string;
}

// Tạo các interfaces cho các bảng khác tương tự
interface DiscountCode {
  id: string;
  package_id: string;
  code: string;
  discount_percent: number;
  starting_date: Date;
  expiration_date: Date;
  description: string;
  created_at: Date;
  is_active: boolean;
}

interface MembershipPackage {
  id: string;
  name: string;
  description: string;
  price_per_month: number;
  monthy_post_limit: number;
  post_approval_priority: boolean;
  display_priority: boolean;
  is_active: boolean;
  created_at: Date;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content_type: string;
  content: any; // Kiểu dữ liệu content có thể là bất kỳ
  sent_at: Date;
  is_active: boolean;
}

interface OTP {
  id: string;
  type: string;
  issued_at: Date;
  expiration_time: Date;
  token: string;
  user_id: string;
  is_used: boolean;
  is_active: boolean;
}

interface Participant {
  conversation_id: string;
  user_id: string;
  joined_at: Date;
  read_last_message_at: Date | null;
  is_active: boolean;
}

interface ProjectScale {
  id: string;
  unit_id: string;
  project_id: string;
  scale: number;
}

interface Project {
  id: string;
  developer_id: string | null;
  project_name: string;
  total_area: number | null;
  starting_date: Date | null;
  completion_date: Date | null;
  address: any; // Kiểu dữ liệu address có thể là bất kỳ
  address_point: any; // Kiểu dữ liệu address_point có thể là bất kỳ
  progression: string;
  status: string;
  images: string[];
  verified: boolean;
  is_active: boolean;
}

interface PropertyType {
  id: string;
  name: string;
  is_active: boolean;
}

interface PropertyTypeProject {
  projects_id: string;
  property_types_id: string;
}

interface RealEstatePost {
  id: string;
  user_id: string;
  project_id: string | null;
  type_id: string;
  status: string;
  title: string;
  description: string;
  area: number;
  address: any; // Kiểu dữ liệu address có thể là bất kỳ
  address_point: any; // Kiểu dữ liệu address_point có thể là bất kỳ
  price: number;
  deposit: number | null;
  is_lease: boolean;
  posted_date: Date;
  expiry_date: Date;
  images: string[];
  videos: string[];
  is_pro_seller: boolean;
  is_priority: boolean;
  features: any; // Kiểu dữ liệu features có thể là bất kỳ
  post_approval_priority: boolean;
  is_active: boolean;
  unit_id: string;
  info_message: any; // Kiểu dữ liệu info_message có thể là bất kỳ
}

interface Session {
  id: string;
  user_id: string;
  starting_date: Date;
  expiration_date: Date;
  updated_at: Date;
  is_active: boolean;
}

interface Subscription {
  id: string;
  user_id: string;
  package_id: string;
  transaction_id: string | null;
  starting_date: Date;
  expiration_date: Date;
  trans_id: string;
  is_active: boolean;
}

interface Transaction {
  id: string;
  user_id: string;
  discount_id: string;
  package_id: string;
  num_of_subscription_month: number;
  app_trans_id: string;
  status: string;
  timestamp: Date;
  amount: number;
  is_active: boolean;
}

interface Unit {
  id: string;
  unit_name: string;
}

interface UserBlogFavorite {
  user_id: string;
  blog_id: string;
  timestamp: Date;
}

interface UserBlogView {
  id: string;
  user_id: string;
  blog_id: string;
  view_timestamp: Date;
}

interface UserCommentLike {
  comment_id: string;
  user_id: string;
  timestamp: Date;
}

interface UserPostFavorite {
  users_id: string;
  real_estate_posts_id: string;
  like_timestamp: Date;
}

interface UserPostView {
  real_estate_posts_id: string;
  users_id: string;
  view_timestamp: Date;
}

interface User {
  id: string;
  status: string;
  is_identity_verified: boolean;
  role: string;
  email: string;
  password: string;
  address: any; // Kiểu dữ liệu address có thể là bất kỳ
  first_name: string;
  last_name: string;
  gender: boolean;
  avatar: string;
  dob: Date;
  phone: string;
  ban_reason: string | null;
  is_active: boolean;
  last_active_at: Date;
  created_at: Date;
  updated_at: Date | null;
  banned_util: Date | null;
}

