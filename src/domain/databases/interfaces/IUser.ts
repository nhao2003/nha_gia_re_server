export interface IUser {
  id: string;
  status: string;
  is_identity_verified: boolean;
  role: string;
  email: string;
  password: string;
  address: any; // Define an appropriate type for your address JSON
  first_name: string;
  last_name: string;
  gender: boolean;
  avatar: string | null;
  dob: Date;
  phone: string | null;
  last_active_at: Date;
  created_at: Date;
  updated_at: Date | null;
  banned_util: Date | null;
  ban_reason: string | null;
  is_active: boolean;

  // One-to-Many relationship
  otps: any; // Define an appropriate type for your otps

  // One-to-Many relationship
  sessions: any; // Define an appropriate type for your sessions

  // Many-to-Many relationship

  //Methods
}
