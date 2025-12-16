/**
 * Sober Savings Product Definitions
 * 
 * These are the subscription plans available for the app.
 * Prices are in JPY (Japanese Yen).
 */

export const PRODUCTS = {
  PRO_MONTHLY: {
    id: 'pro_monthly',
    name: 'Sober Savings Pro (Monthly)',
    description: 'Full access to all Pro features including AI Coach, cloud sync, and detailed analytics.',
    priceAmount: 480, // ¥480/month
    currency: 'jpy',
    interval: 'month' as const,
    features: [
      'クラウド同期 - 複数デバイスでデータを同期',
      'AIコーチ - パーソナライズされた禁酒アドバイス',
      'カスタム目標 - 無制限の目標設定',
      '詳細統計 - 週次・月次レポート',
      '広告非表示',
    ],
  },
  PRO_YEARLY: {
    id: 'pro_yearly',
    name: 'Sober Savings Pro (Yearly)',
    description: 'Full access to all Pro features with 2 months free!',
    priceAmount: 3980, // ¥3,980/year (save ¥1,780)
    currency: 'jpy',
    interval: 'year' as const,
    features: [
      'クラウド同期 - 複数デバイスでデータを同期',
      'AIコーチ - パーソナライズされた禁酒アドバイス',
      'カスタム目標 - 無制限の目標設定',
      '詳細統計 - 週次・月次レポート',
      '広告非表示',
      '年額プランで2ヶ月分お得！',
    ],
  },
} as const;

export type ProductId = keyof typeof PRODUCTS;

export const FREE_PLAN_FEATURES = [
  '基本的な節約トラッキング',
  '3つのプリセット目標',
  'ローカルストレージでのデータ保存',
  '基本的なモチベーション機能',
];

export const PRO_PLAN_LIMITS = {
  maxCustomGoals: Infinity,
  aiCoachEnabled: true,
  cloudSyncEnabled: true,
  detailedAnalytics: true,
};

export const FREE_PLAN_LIMITS = {
  maxCustomGoals: 3,
  aiCoachEnabled: false,
  cloudSyncEnabled: false,
  detailedAnalytics: false,
};
