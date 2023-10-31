import { PropertyFeatures } from '~/domain/typing/Features';
import Address from '~/domain/typing/address';

type CreatePost = {
  type_id: string;
  title: string;
  description: string;
  price: number;
  desposit: number;
  area: number;
  is_lease: boolean;
  is_pro_seller: boolean;
  images: string[];
  videos?: string[];
  address: Address;
  features: PropertyFeatures;
  user_id: string;
  project?: {
    id: string | null;
    project_name: string | null;
  } | null;
};
export default CreatePost;
