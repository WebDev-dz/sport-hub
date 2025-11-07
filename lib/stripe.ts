"use server"
import Stripe from "stripe";

if (!process.env.STRIPE_KEY) {
  throw new Error("STRIPE_KEY is not set");
}

 const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: "2025-09-30.clover",
});

export interface StripePlan {
    id: string;
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
}

/**
 * Fetch pricing plans from Stripe and format them for the pricing component
 */
export async function getStripePlans(): Promise<StripePlan[]> {
  try {
    // Get all active products with their prices
    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    });

    const plans: StripePlan[] = [];

    for (const product of products.data) {
      // Fetch prices for this product
      const prices = await stripe.prices.list({
        product: product.id,
        active: true,
      });

      // Separate monthly and annual prices
      const monthlyPrice = prices.data.find(
        (p) => p.recurring?.interval === "month"
      );
      const annualPrice = prices.data.find(
        (p) => p.recurring?.interval === "year"
      );

      if (monthlyPrice) {
        // Extract features from metadata or description
        const features = product.metadata.features
          ? JSON.parse(product.metadata.features)
          : [];
        
        const description =
          product.description || `Best for ${product.name.toLowerCase()} users`;

        plans.push({
          id: prices.data[0].id,
          name: product.name.toLocaleLowerCase(),
          price: (monthlyPrice.unit_amount! / 100).toFixed(0),
          yearlyPrice: annualPrice
            ? (annualPrice.unit_amount! / 100).toFixed(0)
            : ((monthlyPrice.unit_amount! / 100) * 12).toFixed(0),
          period: "per month",
          features: features.length > 0 ? features : getDefaultFeatures(product.name),
          description,
          buttonText: "Get Started",
          href: "/sign-up",
          isPopular: product.metadata.popular === "true",
        });
      }
    }

    console.log({plans})

    // Sort plans by price
    return plans.sort((a, b) => Number(a.price) - Number(b.price));
  } catch (error) {
    console.error("Error fetching Stripe plans:", error);
    // Return default fallback plans
    return getDefaultPlans();
  }
}


export async function StripeSubscription(customer_id: string, plan: string) {
    
  const res = await stripe.subscriptions.create({
    customer: customer_id,
    items: [
      {
        plan: plan,
      },
    ],
  });
  return res;
}

/**
 * Get default features based on plan name
 */
function getDefaultFeatures(planName: string): string[] {
  const lowerName = planName.toLowerCase();

  if (lowerName.includes("pro")) {
    return [
      "Unlimited projects",
      "Advanced analytics",
      "24-hour support response time",
      "Full API access",
      "Priority support",
    ];
  } else if (lowerName.includes("plus")) {
    return [
      "Up to 10 projects",
      "Basic analytics",
      "48-hour support response time",
      "Limited API access",
    ];
  }

  return ["Basic features"];
}

/**
 * Fallback default plans if Stripe fails
 */
function getDefaultPlans(): StripePlan[] {
  return [
    {
        id: "plus",
      name: "Plus",
      price: "20",
      yearlyPrice: "16",
      period: "per month",
      features: [
        "Up to 10 projects",
        "Basic analytics",
        "48-hour support response time",
        "Limited API access",
      ],
      description: "Perfect for individuals and small projects",
      buttonText: "Start Free Trial",
      href: "/sign-up",
      isPopular: false,
    },
    {
        id: "pro",
      name: "Pro",
      price: "50",
      yearlyPrice: "40",
      period: "per month",
      features: [
        "Unlimited projects",
        "Advanced analytics",
        "24-hour support response time",
        "Full API access",
        "Priority support",
      ],
      description: "Ideal for growing teams and businesses",
      buttonText: "Get Started",
      href: "/sign-up",
      isPopular: true,
    },
  ];
}

