// CREATE TABLE user_follows (
//     user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//     follow_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//     created_at timestamp without time zone NOT NULL DEFAULT now(),
//     PRIMARY KEY (user_id, follow_id)
// );

import { IUser } from './IUser';

export interface IUserFollow {
  user_id: string;
  follow_id: string;
  created_at: Date;

  user: IUser;
  follow: IUser;
}
