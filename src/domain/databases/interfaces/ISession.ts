export interface ISession {
  id: string;
  user_id: string;
  starting_date: Date;
  expiration_date: Date;
  updated_at: Date;
  is_active: boolean;
}
