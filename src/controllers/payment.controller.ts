import { Request, Response } from 'express';
class PaymentController {
    async createMemberShipPayment (req: Request, res: Response) {
        // const { membershipId } = req.body;
        // const { userId } = req.user;
        // const membership = await Membership.findById(membershipId);
        // if (!membership) {
        //     throw new Error('Membership not found');
        // }
        // const payment = await Payment.create({
        //     membershipId,
        //     userId,
        //     status: 'pending',
        //     amount: membership.price,
        // });
        res.status(200).json({
            status: 'success',
            data: {
                payment: 'Hello',
            },
        });
    }
}
export default new PaymentController();