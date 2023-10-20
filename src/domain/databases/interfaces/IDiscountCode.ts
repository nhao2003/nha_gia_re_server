interface IDiscountCode {
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
export default IDiscountCode;
