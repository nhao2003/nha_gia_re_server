import { Request, Response } from 'express';
import { Service } from 'typedi';
import ServerCodes from '~/constants/server_codes';
import AppResponse from '~/models/AppRespone';
import AccountVerificationRequestService from '~/services/account_verification_request.service';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';

@Service()
class AccountVerificationRequestController {
  constructor(private accountVerificationRequestService: AccountVerificationRequestService) {}

  public readonly getAllByQuery = wrapRequestHandler(async (req, res) => {
    const query = this.accountVerificationRequestService.buildBaseQuery(req.query);
    const result = await this.accountVerificationRequestService.getAllByQuery(query);
    const appResponse: AppResponse = {
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Get all account verification requests successfully',
      num_of_pages: result.num_of_pages,
      result: result.data,
    };
    res.status(200).json(appResponse);
  });

  public readonly updateRequest = wrapRequestHandler(async (req, res) => {
    const { id } = req.params;
    const { is_verified, rejected_info } = req.body;
    await this.accountVerificationRequestService.updateRequest(id, is_verified, rejected_info);
    const appResponse: AppResponse = {
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Update account verification request successfully',
    };
    res.status(200).json(appResponse);
  });

  public readonly sendRequest = wrapRequestHandler(async (req: Request, res: Response) => {
    const user_id = req.user!.id;
    await this.accountVerificationRequestService.createRequest(user_id, req.body);
    const appResponse: AppResponse = {
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Send account verification request successfully',
    };
    res.status(200).json(appResponse);
  });

  public getLatestRequest = wrapRequestHandler(async (req: Request, res: Response) => {
    const user_id = req.user!.id;
    const result = await this.accountVerificationRequestService.getLastestRequest(user_id);
    const appResponse: AppResponse = {
      status: 'success',
      code: ServerCodes.CommomCode.Success,
      message: 'Get latest account verification request successfully',
      result,
    };
    res.status(200).json(appResponse);
  });
}

export default AccountVerificationRequestController;
