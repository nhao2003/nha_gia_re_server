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
  address: any; // Define an appropriate type for your address JSON
  address_point: string | null;
  price: number;
  desposit: number | null;
  is_lease: boolean;
  posted_date: Date;
  expiry_date: Date;
  images: string[];
  videos: string[];
  is_pro_seller: boolean;
  info_message: string | null | undefined;
  is_priority: boolean;
  features: any; // Define an appropriate type for your features JSON
  post_approval_priority: boolean;
  update_count: number;
  is_active: boolean;
}
export default IRealEstatePost;
