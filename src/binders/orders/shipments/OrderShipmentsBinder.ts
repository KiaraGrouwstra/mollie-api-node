import { CreateParameters, GetParameters, ListParameters, UpdateParameters } from './parameters';
import ApiError from '../../../errors/ApiError';
import Callback from '../../../types/Callback';
import List from '../../../data/list/List';
import InnerBinder from '../../InnerBinder';
import Shipment, { ShipmentData } from '../../../data/orders/shipments/Shipment';
import TransformingNetworkClient from '../../../TransformingNetworkClient';
import checkId from '../../../plumbing/checkId';
import renege from '../../../plumbing/renege';

function getPathSegments(orderId: string) {
  return `orders/${orderId}/shipments`;
}

export default class OrderShipmentsBinder extends InnerBinder<ShipmentData, Shipment> {
  constructor(protected readonly networkClient: TransformingNetworkClient) {
    super();
  }

  /**
   * Retrieve all shipments for an order.
   *
   * @since 3.0.0
   * @see https://docs.mollie.com/reference/v2/shipments-api/list-shipments
   */
  public all: OrderShipmentsBinder['list'] = this.list;
  /**
   * Retrieve all shipments for an order.
   *
   * @since 3.0.0
   * @see https://docs.mollie.com/reference/v2/shipments-api/list-shipments
   */
  public page: OrderShipmentsBinder['list'] = this.list;

  /**
   * The **Create Shipment API** is used to ship order lines created by the /reference/v2/orders-api/create-order.
   *
   * When using *Klarna Pay later* and *Klarna Slice it* this is mandatory for the order amount to be captured. A capture will automatically be created for the shipment.
   *
   * The word "shipping" is used in the figurative sense here. It can also mean that a service was provided or digital content was delivered.
   *
   * @since 3.0.0
   * @see https://docs.mollie.com/reference/v2/shipments-api/create-shipment
   */
  public create(parameters: CreateParameters): Promise<Shipment>;
  public create(parameters: CreateParameters, callback: Callback<Shipment>): void;
  public create(parameters: CreateParameters) {
    if (renege(this, this.create, ...arguments)) return;
    const orderId = this.getParentId(parameters.orderId);
    if (!checkId(orderId, 'order')) {
      throw new ApiError('The order id is invalid');
    }
    const { orderId: _, ...data } = parameters;
    return this.networkClient.post<ShipmentData, Shipment>(getPathSegments(orderId), data);
  }

  /**
   * Retrieve a single shipment and the order lines shipped by a shipment's ID.
   *
   * @since 3.0.0
   * @see https://docs.mollie.com/reference/v2/shipments-api/get-shipment
   */
  public get(id: string, parameters: GetParameters): Promise<Shipment>;
  public get(id: string, parameters: GetParameters, callback: Callback<Shipment>): void;
  public get(id: string, parameters: GetParameters) {
    if (renege(this, this.get, ...arguments)) return;
    if (!checkId(id, 'shipment')) {
      throw new ApiError('The orders_shipments id is invalid');
    }
    // parameters ?? {} is used here, because in case withParent is used, parameters could be omitted.
    const orderId = this.getParentId((parameters ?? {}).orderId);
    if (!checkId(orderId, 'order')) {
      throw new ApiError('The order id is invalid');
    }
    const { orderId: _, ...query } = parameters ?? {};
    return this.networkClient.get<ShipmentData, Shipment>(`${getPathSegments(orderId)}/${id}`, query);
  }

  /**
   * This endpoint can be used to update the tracking information of a shipment.
   *
   * @since 3.0.0
   * @see https://docs.mollie.com/reference/v2/shipments-api/update-shipment
   */
  public update(id: string, parameters: UpdateParameters): Promise<Shipment>;
  public update(id: string, parameters: UpdateParameters, callback: Callback<Shipment>): void;
  public update(id: string, parameters: UpdateParameters) {
    if (renege(this, this.update, ...arguments)) return;
    if (!checkId(id, 'shipment')) {
      throw new ApiError('The orders_shipments id is invalid');
    }
    const orderId = this.getParentId(parameters.orderId);
    if (!checkId(orderId, 'order')) {
      throw new ApiError('The order id is invalid');
    }
    const { orderId: _, ...data } = parameters;
    return this.networkClient.patch<ShipmentData, Shipment>(`${getPathSegments(orderId)}/${id}`, data);
  }

  /**
   * Retrieve all shipments for an order.
   *
   * @since 3.0.0
   * @see https://docs.mollie.com/reference/v2/shipments-api/list-shipments
   */
  public list(parameters: ListParameters): Promise<List<Shipment>>;
  public list(parameters: ListParameters, callback: Callback<List<Shipment>>): void;
  public list(parameters: ListParameters) {
    if (renege(this, this.list, ...arguments)) return;
    // parameters ?? {} is used here, because in case withParent is used, parameters could be omitted.
    const orderId = this.getParentId((parameters ?? {}).orderId);
    if (!checkId(orderId, 'order')) {
      throw new ApiError('The order id is invalid');
    }
    const { orderId: _, ...query } = parameters ?? {};
    return this.networkClient.list<ShipmentData, Shipment>(getPathSegments(orderId), 'shipments', query).then(result => this.injectPaginationHelpers(result, this.list, parameters));
  }
}
