import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata = {
  title: "Checkout",
  description: "Complete your Biryani House Dordrecht delivery or takeaway order.",
  robots: { index: false, follow: false }
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
