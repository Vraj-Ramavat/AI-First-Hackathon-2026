import VIPAuthCard from "@/src/components/auth/VIPAuthCard";

export const metadata = {
  title: "StockSaathi | VIP Sign Up",
  description: "Create an account to access StockSaathi AI inventory dashboard.",
};

export default function SignupPage() {
  return <VIPAuthCard initialTab="signup" />;
}
