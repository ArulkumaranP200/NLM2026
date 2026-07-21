// Razorpay checkout is not wired up yet — react-native-razorpay is a native module
// that requires an EAS dev-client build (not Expo Go), and test/live keys haven't
// been confirmed. See mobileapp plan doc.
//
// The real order is already created server-side via /profiles/{id}/create-payment-order/
// before this runs (same endpoint the web app uses) — once react-native-razorpay is
// added, this function should open the native checkout with `order` and, on success,
// POST { razorpay_order_id, razorpay_payment_id, razorpay_signature } to
// /profiles/{id}/verify-payment/. No other screen code should need to change.
export async function startRazorpayCheckout(order) {
  throw new Error('Payment integration coming soon.');
}
