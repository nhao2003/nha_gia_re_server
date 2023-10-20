interface IComment {
  id: string;
  parent_id: string | null;
  blog_id: string;
  user_id: string;
  reply_to_user_id: string | null;
  comment: string;
  timestamp: Date;
  is_active: boolean;
}
export default IComment;