
export const OrderStatus = [
  { langKey: 'Order.all', name: 'All', value: '0', listShow: true },
  { langKey: 'Order.created', name: 'Created', value: 'INIT', listShow: true },
  // { langKey: 'Order.pending', name: 'Pending', value: 'PENDING', listShow: true },
  { langKey: 'Order.pendingReview', name: 'Pending review', value: 'PENDING_REVIEW', listShow: true },
  { langKey: 'Order.Tobedelivered', name: 'To be delivered', value: 'TO_BE_DELIVERED', listShow: true },
  { langKey: 'Order.partiallyShipped', name: 'Partially Shipped', value: 'PARTIALLY_SHIPPED', listShow: true },
  { langKey: 'Order.Shipped', name: 'Shipped', value: 'SHIPPED', listShow: true },
  { langKey: 'Order.partiallyDelivered', name: 'Partially Delivered', value: 'PARTIALLY_DELIVERED', listShow: true },
  { langKey: 'Order.delivered', name: 'Delivered', value: 'DELIVERED', listShow: true },
  { langKey: 'Order.Completed', name: 'Completed', value: 'COMPLETED', listShow: true },
  { langKey: 'Order.cancelled', name: 'Cancelled', value: 'VOID', listShow: true },
  { langKey: 'Order.rejected', name: 'Rejected', value: 'REJECTED', listShow: true } // listShow not work
];

export const ShippStatus = [
  { langKey: 'Order.notshipped', name: 'Not Shipped', value: 'NOT_YET_SHIPPED' },
  { langKey: 'Order.partiallyShipped', name: 'Partially Shipped', value: 'PART_SHIPPED' },
  { langKey: 'Order.Shipped', name: 'Shipped', value: 'SHIPPED' },
  { langKey: 'Order.partiallyDelivered', name: 'Partially Delivered', value: 'PARTIALLY_DELIVERED' },
  { langKey: 'Order.delivered', name: 'Delivered', value: 'DELIVERED' },
  { langKey: 'Order.rejected', name: 'Rejected', value: 'REJECTED' }
];

export const PaymentStatus = [
  { langKey: 'Order.Unpaid', name: 'Unpaid', value: 'NOT_PAID' },
  { langKey: 'Order.authorized', name: 'Authorized', value: 'AUTHORIZED' },
  { langKey: 'Order.Paid', name: 'Paid', value: 'PAID' },
  { langKey: 'Order.Refund', name: 'Refund', value: 'REFUND' },
  { langKey: 'Order.Paying', name: 'Paying', value: 'PAYING' }
];

export const ReturnOrderStatus = [
  { langKey: 'Order.pendingReview', name: 'Pending review', value: 'PENDING_REVIEW', listShow: true },
  { langKey: 'Order.Tobedelivered', name: 'To be delivered', value: 'TO_BE_DELIVERED', listShow: true },

  { langKey: 'Order.reviewRejected', name: 'Review rejected', value: 'REVIEW_REJECTED', listShow: true },
  { langKey: 'Order.toBeReceived', name: 'To be received', value: 'TO_BE_RECEIVED', listShow: true },
  { langKey: 'Order.pendingRefund', name: 'Pending refund', value: 'PENDING_REFUND', listShow: true },
  { langKey: 'Order.receivedRejected', name: 'Received rejected', value: 'RECEIVED_REJECTED', listShow: true },
  { langKey: 'Order.Completed', name: 'Completed', value: 'COMPLETED', listShow: true },
  { langKey: 'Order.refundRejected', name: 'Refund rejected', value: 'REFUND_REJECTED', listShow: true },
  { langKey: 'Order.refundFailed', name: 'Refund failed', value: 'REFUND_FAILED', listShow: true }
];





export function getOrderStatusValue(statusName, value) {
  switch (statusName) {
    case 'OrderStatus':
      let orderStatus = OrderStatus.find((x) => x.value === value);
      return orderStatus ? orderStatus.langKey : 'Order.unknown';
    case 'ShippStatus':
      let shippStatus = ShippStatus.find((x) => x.value === value);
      return shippStatus ? shippStatus.langKey : 'Order.unknown';
    case 'PaymentStatus':
      let paymentStatus = PaymentStatus.find((x) => x.value === value);
      return paymentStatus ? paymentStatus.langKey : 'Order.unknown';
    case 'ReturnOrderStatus':
      let returnOrderStatus = ReturnOrderStatus.find((x) => x.value === value);
      return returnOrderStatus ? returnOrderStatus.langKey : 'Order.unknown';
    default:
      return "Order.unknown";
  }

}
