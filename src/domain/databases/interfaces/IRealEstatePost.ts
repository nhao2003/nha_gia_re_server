import Address from "~/domain/typing/address";

interface IRealEstatePost {
  id: string;
  user_id: string;
  project_id: string;
  type_id: string;
  unit_id: string;
  status: string;
  title: string;
  description: string;
  area: number;
  address: Address; // Define an appropriate type for your address JSON
  address_point: string | null;
  price: number;
  deposit: number | null;
  is_lease: boolean;
  posted_date: Date;
  expiry_date: Date;
  images: string[];
  videos: string[];
  is_pro_seller: boolean;
  info_message: string | null | undefined;
  priority_level: number;
  features: any; // Define an appropriate type for your features JSON
  post_approval_priority_point: number;
  update_count: number;
  is_active: boolean;
}
export default IRealEstatePost;
