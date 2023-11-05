interface IMembershipPackage {
    id: string;
    name: string;
    description: string;
    price_per_month: number;
    monthly_post_limit: number;
    post_approval_priority_point: number;
    display_priority_point: number;
    is_active: boolean;
    created_at: Date;
  }
  export default IMembershipPackage;