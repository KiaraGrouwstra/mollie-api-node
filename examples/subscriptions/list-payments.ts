/**
 * @docs https://docs.mollie.com/reference/v2/subscriptions-api/list-subscriptions-payments
 */
import createMollieClient, { List, Payment } from '@mollie/api-client';

const mollieClient = createMollieClient({ apiKey: 'test_dHar4XY7LxsDOtmnkVtjNVWXLSlXsM' });

(async () => {
  try {
    const payments: List<Payment> = await mollieClient.subscriptionPayments.list({ customerId: 'cst_8wmqcHMN4U', subscriptionId: 'sub_8JfGzs6v3K' });

    console.log(payments);
  } catch (error) {
    console.warn(error);
  }
})();
