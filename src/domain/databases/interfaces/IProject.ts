interface IProject {
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
export default IProject;
