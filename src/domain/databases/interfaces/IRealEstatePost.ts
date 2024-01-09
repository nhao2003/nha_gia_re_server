import Address from "~/domain/typing/address";

interface IRealEstatePost {
  id: string;
  user_id: string;
  project_id: string;
  type_id: string;
  status: string;
  title: string;
  description: string;
  area: number;
  address: Address; // Define an appropriate type for your address JSON
  price: number;
  deposit: number | null;
  is_lease: boolean;
  posted_date: Date;
  expiry_date: Date;
  images: string[];
  videos: string[];
  is_pro_seller: boolean;
  info_message: string | null | undefined;
  display_priority_point: number;
  features: any; // Define an appropriate type for your features JSON
  post_approval_priority_point: number;
  update_count: number;
  is_active: boolean;
  // ts vector document
  document: string;
}
export default IRealEstatePost;
