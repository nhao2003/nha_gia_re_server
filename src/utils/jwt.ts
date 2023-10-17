import jwt, { JwtPayload } from 'jsonwebtoken';
import { AppError } from '~/models/Error';

export interface UserPayload extends JwtPayload {
  id: string;
  session_id: string;
}

export interface VerifyResult {
  payload: UserPayload | JwtPayload | string | undefined;
  expired: boolean;
}

export const signToken = ({
  payload,
  expiresIn,
  secretKey = process.env.JWT_SECRET_KEY as string,
}: {
  payload: string | Buffer | object;
  expiresIn: string | number;
  secretKey?: string;
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(
      payload,
      secretKey,
      {
        algorithm: 'HS256',
        expiresIn,
      },
      (error: Error | null, token: string | undefined) => {
        if (error) {
          reject(new AppError(error.message, 500));
        } else if (!token) {
          reject(new AppError('TOKEN_SIGNING_ERROR', 500));
        } else {
          resolve(token);
        }
      },
    );
  });
};

export function verifyToken(token: string, secretKey: string) {
  return new Promise<VerifyResult>((resolve) => {
    jwt.verify(token, secretKey, (error, payload) => {
      resolve({ payload: payload, expired: error?.name === 'TokenExpiredError' });
    });
  });
}
