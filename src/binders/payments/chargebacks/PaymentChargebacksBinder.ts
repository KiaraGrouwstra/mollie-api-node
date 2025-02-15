import { GetParameters, ListParameters } from './parameters';
import ApiError from '../../../errors/ApiError';
import Callback from '../../../types/Callback';
import Chargeback, { ChargebackData, transform } from '../../../data/chargebacks/Chargeback';
import List from '../../../data/list/List';
import InnerBinder from '../../InnerBinder';
import TransformingNetworkClient from '../../../TransformingNetworkClient';
import checkId from '../../../plumbing/checkId';
import renege from '../../../plumbing/renege';

function getPathSegments(paymentId: string) {
  return `payments/${paymentId}/chargebacks`;
}

export default class PaymentChargebacksBinder extends InnerBinder<ChargebackData, Chargeback> {
  constructor(protected readonly networkClient: TransformingNetworkClient) {
    super();
  }

  /**
   * Retrieve all received chargebacks. If the payment-specific endpoint is used, only chargebacks for that specific payment are returned.
   *
   * The results are paginated. See pagination for more information.
   *
   * @since 1.1.1
   * @see https://docs.mollie.com/reference/v2/chargebacks-api/list-chargebacks
   */
  public all: PaymentChargebacksBinder['list'] = this.list;
  /**
   * Retrieve all received chargebacks. If the payment-specific endpoint is used, only chargebacks for that specific payment are returned.
   *
   * The results are paginated. See pagination for more information.
   *
   * @since 3.0.0
   * @see https://docs.mollie.com/reference/v2/chargebacks-api/list-chargebacks
   */
  public page: PaymentChargebacksBinder['list'] = this.list;

  /**
   * Retrieve a single chargeback by its ID. Note the original payment's ID is needed as well.
   *
   * If you do not know the original payment's ID, you can use the chargebacks list endpoint.
   *
   * @since 1.1.1
   * @see https://docs.mollie.com/reference/v2/chargebacks-api/get-chargeback
   */
  public get(id: string, parameters: GetParameters): Promise<Chargeback>;
  public get(id: string, parameters: GetParameters, callback: Callback<Chargeback>): void;
  public get(id: string, parameters: GetParameters) {
    if (renege(this, this.get, ...arguments)) return;
    if (!checkId(id, 'refund')) {
      throw new ApiError('The payments_refund id is invalid');
    }
    // parameters ?? {} is used here, because in case withParent is used, parameters could be omitted.
    const paymentId = this.getParentId((parameters ?? {}).paymentId);
    if (!checkId(paymentId, 'payment')) {
      throw new ApiError('The payment id is invalid');
    }
    const { paymentId: _, ...query } = parameters;
    return this.networkClient.get<ChargebackData, Chargeback>(`${getPathSegments(paymentId)}/${id}`, query);
  }

  /**
   * Retrieve all received chargebacks. If the payment-specific endpoint is used, only chargebacks for that specific payment are returned.
   *
   * The results are paginated. See pagination for more information.
   *
   * @since 3.0.0
   * @see https://docs.mollie.com/reference/v2/chargebacks-api/list-chargebacks
   */
  public list(parameters: ListParameters): Promise<List<Chargeback>>;
  public list(parameters: ListParameters, callback: Callback<List<Chargeback>>): void;
  public list(parameters: ListParameters) {
    if (renege(this, this.list, ...arguments)) return;
    // parameters ?? {} is used here, because in case withParent is used, parameters could be omitted.
    const paymentId = this.getParentId((parameters ?? {}).paymentId);
    if (!checkId(paymentId, 'payment')) {
      throw new ApiError('The payment id is invalid');
    }
    const { paymentId: _, ...query } = parameters;
    return this.networkClient.list<ChargebackData, Chargeback>(getPathSegments(paymentId), 'chargebacks', query).then(result => this.injectPaginationHelpers(result, this.list, parameters));
  }
}
