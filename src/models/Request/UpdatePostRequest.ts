
import { PropertyFeatures } from "~/domain/typing/Features";
import Address from "~/domain/typing/address";

type UpdatePostRequest = {
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
    project?: {
        id: string | null;
        project_name: string | null;
    } | null;
}
export default UpdatePostRequest;
