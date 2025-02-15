import { CancelParameters, CreateParameters, GetParameters, ListParameters, UpdateParameters } from './parameters';
import { PaymentData } from '../../data/payments/data';
import ApiError from '../../errors/ApiError';
import Callback from '../../types/Callback';
import List from '../../data/list/List';
import Payment from '../../data/payments/Payment';
import Binder from '../Binder';
import TransformingNetworkClient from '../../TransformingNetworkClient';
import checkId from '../../plumbing/checkId';
import renege from '../../plumbing/renege';

const pathSegment = 'payments';

export default class PaymentsBinder extends Binder<PaymentData, Payment> {
  constructor(protected readonly networkClient: TransformingNetworkClient) {
    super();
  }

  /**
   * Retrieve all payments created with the current website profile, ordered from newest to oldest.
   *
   * The results are paginated. See pagination for more information.
   *
   * @since 2.0.0
   * @see https://docs.mollie.com/reference/v2/payments-api/list-payments
   */
  public all: PaymentsBinder['list'] = this.list;
  /**
   * Retrieve all payments created with the current website profile, ordered from newest to oldest.
   *
   * The results are paginated. See pagination for more information.
   *
   * @since 3.0.0
   * @see https://docs.mollie.com/reference/v2/payments-api/list-payments
   */
  public page: PaymentsBinder['list'] = this.list;
  /**
   * Some payment methods can be canceled by the merchant for a certain amount of time, usually until the next business day. Or as long as the payment status is `open`. Payments may be canceled
   * manually from the Mollie Dashboard, or programmatically by using this endpoint.
   *
   * The `isCancelable` property on the Payment object will indicate if the payment can be canceled.
   *
   * @since 2.0.0
   * @see https://docs.mollie.com/reference/v2/payments-api/cancel-payment
   */
  public delete: PaymentsBinder['cancel'] = this.cancel;

  /**
   * Payment creation is elemental to the Mollie API: this is where most payment implementations start off.
   *
   * Once you have created a payment, you should redirect your customer to the URL in the `_links.checkout` property from the response.
   *
   * To wrap your head around the payment process, an explanation and flow charts can be found in the Payments API Overview.
   *
   * @since 2.0.0
   * @see https://docs.mollie.com/reference/v2/payments-api/create-payment
   */
  public create(parameters: CreateParameters): Promise<Payment>;
  public create(parameters: CreateParameters, callback: Callback<Payment>): void;
  public create(parameters: CreateParameters) {
    if (renege(this, this.create, ...arguments)) return;
    const { include, ...data } = parameters;
    const query = include != undefined ? { include } : undefined;
    return this.networkClient.post<PaymentData, Payment>(pathSegment, data, query);
  }

  /**
   * Retrieve a single payment object by its payment token.
   *
   * @since 2.0.0
   * @see https://docs.mollie.com/reference/v2/payments-api/get-payment
   */
  public get(id: string, parameters?: GetParameters): Promise<Payment>;
  public get(id: string, parameters: GetParameters, callback: Callback<Payment>): void;
  public get(id: string, parameters?: GetParameters) {
    if (renege(this, this.get, ...arguments)) return;
    if (!checkId(id, 'payment')) {
      throw new ApiError('The payment id is invalid');
    }
    return this.networkClient.get<PaymentData, Payment>(`${pathSegment}/${id}`, parameters);
  }

  /**
   * Retrieve all payments created with the current website profile, ordered from newest to oldest.
   *
   * The results are paginated. See pagination for more information.
   *
   * @since 3.0.0
   * @see https://docs.mollie.com/reference/v2/payments-api/list-payments
   */
  public list(parameters?: ListParameters): Promise<List<Payment>>;
  public list(parameters: ListParameters, callback: Callback<List<Payment>>): void;
  public list(parameters: ListParameters = {}) {
    if (renege(this, this.list, ...arguments)) return;
    return this.networkClient.list<PaymentData, Payment>(pathSegment, 'payments', parameters).then(result => this.injectPaginationHelpers(result, this.list, parameters));
  }

  /**
   * This endpoint can be used to update some details of a created payment.
   *
   * @since 3.2.0
   * @see https://docs.mollie.com/reference/v2/payments-api/update-payment
   */
  public update(id: string, parameters: UpdateParameters): Promise<Payment>;
  public update(id: string, parameters: UpdateParameters, callback: Callback<Payment>): void;
  public update(id: string, parameters: UpdateParameters) {
    if (renege(this, this.update, ...arguments)) return;
    if (!checkId(id, 'payment')) {
      throw new ApiError('The payment id is invalid');
    }
    return this.networkClient.patch<PaymentData, Payment>(`${pathSegment}/${id}`, parameters);
  }

  /**
   * Some payment methods can be canceled by the merchant for a certain amount of time, usually until the next business day. Or as long as the payment status is `open`. Payments may be canceled
   * manually from the Mollie Dashboard, or programmatically by using this endpoint.
   *
   * The `isCancelable` property on the Payment object will indicate if the payment can be canceled.
   *
   * @since 2.0.0
   * @see https://docs.mollie.com/reference/v2/payments-api/cancel-payment
   */
  public cancel(id: string, parameters?: CancelParameters): Promise<Payment>;
  public cancel(id: string, parameters: CancelParameters, callback: Callback<List<Payment>>): void;
  public cancel(id: string, parameters?: CancelParameters) {
    if (renege(this, this.cancel, ...arguments)) return;
    if (!checkId(id, 'payment')) {
      throw new ApiError('The payment id is invalid');
    }
    return this.networkClient.delete<PaymentData, Payment>(`${pathSegment}/${id}`, parameters);
  }
}
