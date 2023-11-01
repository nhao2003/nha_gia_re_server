interface ITransaction {
  id: string;
  user_id: string;
  discount_id: string | null;
  package_id?: string;
  num_of_subscription_month: number;
  app_trans_id: string;
  status: string;
  timestamp: Date;
  amount: number;
  is_active: boolean;
}
export default ITransaction;
