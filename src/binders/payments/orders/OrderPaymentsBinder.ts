import { CreateParameters } from './parameters';
import { PaymentData } from '../../../data/payments/data';
import ApiError from '../../../errors/ApiError';
import Callback from '../../../types/Callback';
import InnerBinder from '../../InnerBinder';
import Payment from '../../../data/payments/Payment';
import TransformingNetworkClient from '../../../TransformingNetworkClient';
import checkId from '../../../plumbing/checkId';
import renege from '../../../plumbing/renege';

function getPathSegments(orderId: string) {
  return `orders/${orderId}/payments`;
}

export default class OrderPaymentsBinder extends InnerBinder<PaymentData, Payment> {
  constructor(protected readonly networkClient: TransformingNetworkClient) {
    super();
  }

  /**
   * An order has an automatically created payment that your customer can use to pay for the order. When the payment expires you can create a new payment for the order using this endpoint.
   *
   * A new payment can only be created while the status of the order is `created`, and when the status of the existing payment is either `expired`, `canceled` or `failed`.
   *
   * Note that order details (for example `amount` or `webhookUrl`) can not be changed using this endpoint.
   *
   * @since 3.1.0
   * @see https://docs.mollie.com/reference/v2/orders-api/create-order-payment
   */
  public create(parameters: CreateParameters): Promise<Payment>;
  public create(parameters: CreateParameters, callback: Callback<Payment>): void;
  public create(parameters: CreateParameters) {
    if (renege(this, this.create, ...arguments)) return;
    const orderId = this.getParentId(parameters.orderId);
    if (!checkId(orderId, 'order')) {
      throw new ApiError('The order id is invalid');
    }
    const { orderId: _, ...data } = parameters;
    return this.networkClient.post<PaymentData, Payment>(getPathSegments(orderId), data);
  }
}
