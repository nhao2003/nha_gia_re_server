import Address from '~/domain/typing/address';
import { Progression, ProjectStatus } from '~/constants/enum';
interface IProject {
  id: string;
  developer_id: string | null;
  project_name: string;
  total_area: number | null;
  starting_date: Date | null;
  completion_date: Date | null;
  address: Address; // Kiểu dữ liệu address có thể là bất kỳ
  // address_point: any; // Kiểu dữ liệu address_point có thể là bất kỳ
  progression: Progression | null;
  status: ProjectStatus | null;
  images: string[];
  verified: boolean;
  is_active: boolean;
  scale: Array<any> | null;
}
export default IProject;
