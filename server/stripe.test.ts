import { describe, expect, it, vi } from "vitest";
import { PRODUCTS, FREE_PLAN_FEATURES, PRO_PLAN_LIMITS, FREE_PLAN_LIMITS } from "./products";

describe("Products Configuration", () => {
  it("should have valid PRO_MONTHLY product", () => {
    expect(PRODUCTS.PRO_MONTHLY).toBeDefined();
    expect(PRODUCTS.PRO_MONTHLY.priceAmount).toBe(480);
    expect(PRODUCTS.PRO_MONTHLY.currency).toBe("jpy");
    expect(PRODUCTS.PRO_MONTHLY.interval).toBe("month");
    expect(PRODUCTS.PRO_MONTHLY.features.length).toBeGreaterThan(0);
  });

  it("should have valid PRO_YEARLY product", () => {
    expect(PRODUCTS.PRO_YEARLY).toBeDefined();
    expect(PRODUCTS.PRO_YEARLY.priceAmount).toBe(3980);
    expect(PRODUCTS.PRO_YEARLY.currency).toBe("jpy");
    expect(PRODUCTS.PRO_YEARLY.interval).toBe("year");
    expect(PRODUCTS.PRO_YEARLY.features.length).toBeGreaterThan(0);
  });

  it("should have yearly price less than 12x monthly", () => {
    const yearlyPrice = PRODUCTS.PRO_YEARLY.priceAmount;
    const monthlyAnnual = PRODUCTS.PRO_MONTHLY.priceAmount * 12;
    expect(yearlyPrice).toBeLessThan(monthlyAnnual);
  });

  it("should have free plan features defined", () => {
    expect(FREE_PLAN_FEATURES.length).toBeGreaterThan(0);
  });

  it("should have correct plan limits", () => {
    expect(FREE_PLAN_LIMITS.maxCustomGoals).toBe(3);
    expect(FREE_PLAN_LIMITS.aiCoachEnabled).toBe(false);
    expect(PRO_PLAN_LIMITS.maxCustomGoals).toBe(Infinity);
    expect(PRO_PLAN_LIMITS.aiCoachEnabled).toBe(true);
  });
});

describe("Subscription Plans", () => {
  it("should offer meaningful discount for yearly plan", () => {
    const monthlyTotal = PRODUCTS.PRO_MONTHLY.priceAmount * 12;
    const yearlyPrice = PRODUCTS.PRO_YEARLY.priceAmount;
    const savings = monthlyTotal - yearlyPrice;
    const discountPercent = (savings / monthlyTotal) * 100;
    
    // Should offer at least 20% discount for yearly
    expect(discountPercent).toBeGreaterThan(20);
  });
});
