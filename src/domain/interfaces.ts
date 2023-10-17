// blogs.ts
interface Blog {
  id: string;
  created_at: Date;
  title: string;
  short_description: string;
  author: string;
  thumbnail: string;
  content_link: string;
  is_active: boolean;
}

// comments.ts
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

// developers.ts
interface Developer {
  id: string;
  name: string;
  description: string;
  images: string[];
  is_active: boolean;
}

// discount_codes.ts
interface DiscountCode {
  id: string;
  package_id: string;
  code: string;
  discount_percent: number;
  starting_date: Date;
  expiration_date: Date;
  description: string;
  is_active: boolean;
}

// membership_packages.ts
interface MembershipPackage {
  id: string;
  name: string;
  description: string;
  price_per_month: number;
  monthy_post_limit: number;
  post_approval_priority: boolean;
  display_priority: boolean;
  is_active: boolean;
}

// conversations.ts
interface Conversation {
  id: string;
  created_at: Date;
  last_messsage_id: string;
  is_active: boolean;
}

// messsages.ts
interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content_type: string;
  content: any; // Use the appropriate type for your content
  sent_at: Date;
  is_active: boolean;
}

// project_scale.ts
interface ProjectScale {
  id: string;
  unit_id: string;
  project_id: string;
  scale: number;
}

// projects.ts
interface Project {
  id: string;
  developer_id: string | null;
  project_name: string;
  total_area: number | null;
  starting_date: Date | null;
  completion_date: Date | null;
  address: any; // Define an appropriate type for your address JSON
  address_point: string | null;
  progression: string;
  status: string;
  images: string[];
  verified: boolean;
  is_active: boolean;
}

// property_types.ts
interface PropertyType {
  id: string;
  name: string;
  is_active: boolean;
}

// property_types_projects.ts
interface PropertyTypeProject {
  projects_id: string;
  property_types_id: string;
}

// real_estate_posts.ts
interface RealEstatePost {
  id: string;
  user_id: string;
  project_id: string;
  type_id: string;
  unit_id: string;
  status: string;
  title: string;
  description: string;
  area: number;
  address: any; // Define an appropriate type for your address JSON
  address_point: string | null;
  price: number;
  desposit: number | null;
  is_lease: boolean;
  posted_date: Date;
  expiry_date: Date;
  images: string[];
  videos: string[];
  is_pro_seller: boolean[];
  info_message: string;
  is_priority: boolean;
  features: any; // Define an appropriate type for your features JSON
  post_approval_priority: boolean;
  is_active: boolean;
}

// subscription.ts
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

// transactions.ts
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

// units.ts
interface Unit {
  id: string;
  unit_name: string;
}

// user_blog_favorites.ts
interface UserBlogFavorite {
  user_id: string;
  blog_id: string;
  timestamp: Date;
}

// user_blog_view.ts
interface UserBlogView {
  id: string;
  user_id: string;
  blog_id: string;
  view_timestamp: Date;
}

// user_comment_likes.ts
interface UserCommentLike {
  user_id: string;
  comment_id: string;
  timestamp: Date;
}

// user_post_favorite.ts
interface UserPostFavorite {
  users_id: string;
  real_estate_posts_id: string;
  like_timestamp: Date;
}

// user_post_views.ts
interface UserPostView {
  real_estate_posts_id: string;
  users_id: string;
  view_timestamp: Date;
}

// users.ts
interface User {
  id: string;
  status: string;
  is_identity_verified: boolean;
  role: string;
  email: string;
  password: string;
  address: any; // Define an appropriate type for your address JSON
  first_name: string;
  last_name: string;
  gender: boolean;
  avatar: string | null;
  dob: Date;
  phone: string | null;
  last_active_at: Date;
  confirmation_token: string | null;
  comfirmation_at: Date | null;
  recovery_token: string | null;
  recovery_sent_at: Date | null;
  created_at: Date;
  updated_at: Date | null;
  banned_util: Date | null;
  ban_reason: string | null;
  is_active: boolean;
}
