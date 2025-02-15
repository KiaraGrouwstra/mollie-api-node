import { OrderData, OrderStatus } from './data';
import Helper from '../Helper';
import Nullable from '../../types/Nullable';
import Order from './Order';
import TransformingNetworkClient from '../../TransformingNetworkClient';

export default class OrderHelper extends Helper<OrderData, Order> {
  constructor(networkClient: TransformingNetworkClient, protected readonly links: OrderData['_links']) {
    super(networkClient, links);
  }

  /**
   * Returns whether the order has been created, but nothing else has happened yet.
   */
  public isCreated(this: OrderData): boolean {
    return this.status == OrderStatus.created;
  }

  /**
   * Returns whether the order's payment is successfully completed with a payment method that does not support
   * authorizations.
   */
  public isPaid(this: OrderData): boolean {
    return this.status == OrderStatus.paid;
  }

  /**
   * Returns whether the order's payment is successfully completed with a payment method that does support
   * authorizations. The money will only be transferred once a shipment is created for the order.
   */
  public isAuthorized(this: OrderData): boolean {
    return this.status == OrderStatus.authorized;
  }

  /**
   * Returns whether the order has been canceled.
   */
  public isCanceled(this: OrderData): boolean {
    return this.status == OrderStatus.canceled;
  }

  /**
   * Returns whether the first order line or part of an order line has started shipping. When the order is in this
   * state, it means that your order is partially shipped.
   */
  public isShipping(this: OrderData): boolean {
    return this.status == OrderStatus.shipping;
  }

  /**
   * Returns whether the order has been completed.
   */
  public isCompleted(this: OrderData): boolean {
    return this.status == OrderStatus.completed;
  }

  /**
   * Returns whether the order has expired.
   */
  public isExpired(this: OrderData): boolean {
    return this.status == OrderStatus.expired;
  }

  /**
   * Returns whether the the payment supplier is manually checking the order.
   */
  public isPending(this: OrderData): boolean {
    return this.status == OrderStatus.pending;
  }

  /**
   * Returns the URL your customer should visit to make the payment for the order. This is where you should redirect
   * the customer to after creating the order.
   *
   * As long as the order is still in the `'created'` state, this link can be used by your customer to pay for this
   * order. You can safely share this URL with your customer.
   *
   * Recurring, authorized, paid and finalized orders do not have a checkout URL.
   */
  public getCheckoutUrl(): Nullable<string> {
    if (this.links.checkout == undefined) {
      return null;
    }
    return this.links.checkout.href;
  }
}
