import axios from 'axios';
import { PaymentException, VerificationException } from '../../exception';
import { Receipt } from '../../receipt';
import { ExpressLikeRequest } from '../../utils';
import { zarinpalLinks, ZarinpalVerificationObject } from './specs';

export const verify = async (options: Omit<ZarinpalVerificationObject, 'authority'>, request: ExpressLikeRequest): Promise<Receipt> => {
  const { authority, status } = request.params;
  if (status !== 'OK') {
    throw new PaymentException('Payment canceled by the user.', 'پرداخت توسط کاربر لغو شد.');
  }
  return verifyManually({ ...options, authority: authority });
};

export const verifyManually = async ({ authority, amount, merchantId }: ZarinpalVerificationObject): Promise<Receipt> => {
  const response = await axios.post(
    zarinpalLinks.normal.VERIFICATION,
    {
      authority,
      amount,
      merchant_id: merchantId,
    },
    {}
  );
  console.log(response);
  throw new VerificationException('hi');

  const responseData = (response.data as unknown) as {
    code: number;
    reference_id: number;
    card_pan: String;
    card_hash: String;
    fee_type: String;
    fee: number;
  };

  return {
    referenceId: responseData.reference_id,
    fee: responseData.fee,
  };
};
