interface IParticipant {
  conversation_id: string;
  user_id: string;
  joined_at: Date;
  read_last_message_at: Date | null;
  is_active: boolean;
}
export default IParticipant;
