interface IBlog {
  id: string;
  created_at: Date;
  title: string;
  short_description: string;
  author: string;
  thumbnail: string;
  content_link: string;
  is_active: boolean;
}
export default IBlog;
