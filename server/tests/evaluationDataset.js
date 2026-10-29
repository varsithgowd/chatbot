/**
 * SupportSense AI Evaluation Dataset
 * Standardized benchmark test cases for retrieval quality, citation verification, and fallback accuracy.
 */
const evaluationDataset = [
  {
    id: 'EVAL-01',
    description: 'Password reset procedure inquiry',
    query: 'How do I reset my password?',
    expectedAnswered: true,
    expectedArticleSlug: 'how-to-reset-your-password',
    expectedSection: 'Reset Password via Login Screen',
    expectedKeywords: ['login', 'forgot password', 'email', 'reset link']
  },
  {
    id: 'EVAL-02',
    description: 'Enabling 2FA inquiry',
    query: 'How do I enable two-factor authentication with Google Authenticator?',
    expectedAnswered: true,
    expectedArticleSlug: 'enabling-two-factor-authentication',
    expectedSection: 'Setting Up Authenticator App',
    expectedKeywords: ['two-factor', 'qr code', 'authenticator', 'code']
  },
  {
    id: 'EVAL-03',
    description: 'Physical order tracking inquiry',
    query: 'Where can I track my shipment delivery?',
    expectedAnswered: true,
    expectedArticleSlug: 'how-to-track-an-order-delivery',
    expectedSection: 'Locating Your Tracking Number',
    expectedKeywords: ['orders', 'tracking number', 'courier']
  },
  {
    id: 'EVAL-04',
    description: 'Order cancellation window inquiry',
    query: 'Can I cancel an order I just placed?',
    expectedAnswered: true,
    expectedArticleSlug: 'how-to-cancel-an-order',
    expectedSection: 'Order Cancellation Window',
    expectedKeywords: ['cancel', '60 minutes', 'fulfillment']
  },
  {
    id: 'EVAL-05',
    description: 'Refund eligibility policy inquiry',
    query: 'What is the return window for physical merchandise under the refund policy?',
    expectedAnswered: true,
    expectedArticleSlug: 'fictional-demo-refund-eligibility-policy',
    expectedSection: 'Standard 30-Day Return Window',
    expectedKeywords: ['30 days', 'refund', 'delivery']
  },
  {
    id: 'EVAL-06',
    description: 'Updating billing payment method',
    query: 'How do I update my credit card payment method?',
    expectedAnswered: true,
    expectedArticleSlug: 'updating-your-payment-method',
    expectedSection: 'Adding a New Card',
    expectedKeywords: ['settings', 'billing', 'payment methods', 'card']
  },
  {
    id: 'EVAL-07',
    description: 'Hardware connectivity troubleshooting',
    query: 'My IoT Hub cannot connect to Wi-Fi. How do I fix it?',
    expectedAnswered: true,
    expectedArticleSlug: 'troubleshooting-wifi-and-bluetooth-connectivity',
    expectedSection: 'Resetting Network Configurations',
    expectedKeywords: ['reset button', '2.4 ghz', 'wi-fi']
  },
  {
    id: 'EVAL-08',
    description: 'Downloading invoice PDF',
    query: 'Where can I download my billing receipt and VAT invoice?',
    expectedAnswered: true,
    expectedArticleSlug: 'downloading-billing-invoices-and-receipts',
    expectedSection: 'Accessing Billing History',
    expectedKeywords: ['invoice history', 'download pdf', 'tax invoice']
  },
  {
    id: 'EVAL-09',
    description: 'Hardware LED error state inquiry',
    query: 'What does a solid red LED light mean on my device?',
    expectedAnswered: true,
    expectedArticleSlug: 'resolving-common-device-led-status-codes',
    expectedSection: 'Solid Red or Flashing Red LED',
    expectedKeywords: ['solid red', 'self-test failure', 'power cycle']
  },
  {
    id: 'EVAL-10',
    description: 'Out-of-scope query: Baking recipe (Must trigger fallback)',
    query: 'How do I bake a sourdough loaf with 70% hydration?',
    expectedAnswered: false,
    expectedArticleSlug: null,
    expectedSection: null,
    expectedKeywords: ["couldn't find", 'contact customer support']
  },
  {
    id: 'EVAL-11',
    description: 'Unsupported policy inquiry: 2-year refund guarantee (Must trigger fallback)',
    query: 'Can I get a cash refund after 2 years for damaged shoes?',
    expectedAnswered: false,
    expectedArticleSlug: null,
    expectedSection: null,
    expectedKeywords: ["couldn't find", 'contact customer support']
  },
  {
    id: 'EVAL-12',
    description: 'Draft / Archived isolation: Discontinued USB dongle (Must trigger fallback)',
    query: 'How do I set up the legacy USB dongle from 2021?',
    expectedAnswered: false,
    expectedArticleSlug: null,
    expectedSection: null,
    expectedKeywords: ["couldn't find", 'contact customer support']
  }
];

module.exports = evaluationDataset;

