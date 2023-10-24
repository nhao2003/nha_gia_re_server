interface IOTP {
  id: string;
  type: string;
  issued_at: Date;
  expiration_time: Date;
  token: string;
  user_id: string;
  is_used: boolean;
}
export default IOTP;
