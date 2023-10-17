import { Verify } from "crypto";
import { Request } from "express";
import { User } from "./domain/databases/entity/User";
declare module "express" {
  interface Request {
    user?: User;
    verifyResult?: VerifyResult;
    verifyResultRefreshToken?: VerifyResult;
  }
}
