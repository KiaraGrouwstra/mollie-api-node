import { RefundData, RefundStatus } from './data';
import Helper from '../Helper';
import Refund from './Refund';

export default class RefundHelper extends Helper<RefundData, Refund> {
  /**
   * Returns whether the refund is queued due to a lack of balance. A queued refund can be canceled.
   */
  public isQueued(this: RefundData): boolean {
    return this.status === RefundStatus.queued;
  }

  /**
   * Returns whether the refund is ready to be sent to the bank. You can still cancel the refund if you like.
   */
  public isPending(this: RefundData): boolean {
    return this.status === RefundStatus.pending;
  }

  /**
   * Returns whether the refund is being processed. Cancellation is no longer possible if so.
   */
  public isProcessing(this: RefundData): boolean {
    return this.status === RefundStatus.processing;
  }

  /**
   * Returns whether the refund has been settled to your customer.
   */
  public isRefunded(this: RefundData): boolean {
    return this.status === RefundStatus.refunded;
  }

  /**
   * Returns whether the refund has failed after processing.
   */
  public isFailed(this: RefundData): boolean {
    return this.status === RefundStatus.failed;
  }
}
