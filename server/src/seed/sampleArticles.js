const sampleArticles = [
  {
    title: 'How to Reset Your Password',
    slug: 'how-to-reset-your-password',
    category: 'Login and Security',
    product: 'SupportSense Web App',
    tags: ['password', 'reset', 'forgot password', 'credentials', 'security', 'login'],
    status: 'published',
    content: 'If you have forgotten your password or need to reset it for security reasons, you can initiate a self-service password reset directly from the login page or within your account settings.',
    sections: [
      {
        heading: 'Reset Password via Login Screen',
        content: 'Open the login page, select "Forgot Password", enter your registered email address, and click "Send Reset Link". Follow the instructions sent to your registered email within 15 minutes.'
      },
      {
        heading: 'Password Complexity Requirements',
        content: 'Your new password must be at least 10 characters long and include an uppercase letter, a lowercase letter, a number, and a special character (@$!%*?&).'
      },
      {
        heading: 'Troubleshooting Reset Emails',
        content: 'If you do not receive the email within 5 minutes, check your spam or junk folder, or verify that the email address provided matches your account.'
      }
    ]
  },
  {
    title: 'Changing Your Account Email Address',
    slug: 'changing-your-account-email-address',
    category: 'Account Support',
    product: 'SupportSense Web App',
    tags: ['email', 'account', 'profile', 'change email', 'verification'],
    status: 'published',
    content: 'You can update your primary login email address at any time from your Account Settings. For security, both your old and new email addresses will receive verification notices.',
    sections: [
      {
        heading: 'Step-by-Step Email Update',
        content: 'Go to Settings > Account > Profile. Click "Change Email", enter your new email address, and confirm with your current account password.'
      },
      {
        heading: 'Confirming the New Email Address',
        content: 'A confirmation link will be delivered to your new email address. You must click this verification link within 24 hours to finalize the change.'
      }
    ]
  },
  {
    title: 'Enabling Two-Factor Authentication (2FA)',
    slug: 'enabling-two-factor-authentication',
    category: 'Login and Security',
    product: 'SupportSense Cloud',
    tags: ['2fa', 'mfa', 'two-factor', 'authenticator', 'security', 'totp'],
    status: 'published',
    content: 'Two-Factor Authentication adds an extra layer of defense to your SupportSense account by requiring a 6-digit verification code in addition to your password.',
    sections: [
      {
        heading: 'Setting Up Authenticator App',
        content: 'Navigate to Security Settings > Two-Factor Authentication. Click "Enable 2FA", scan the displayed QR code using Google Authenticator or Authy, and enter the 6-digit confirmation code.'
      },
      {
        heading: 'Saving Backup Recovery Codes',
        content: 'Store the 8 single-use recovery codes in a secure location. You will need these backup codes if you lose access to your mobile authenticator device.'
      }
    ]
  },
  {
    title: 'Troubleshooting Login Failures',
    slug: 'troubleshooting-login-failures',
    category: 'Login and Security',
    product: 'SupportSense Web App',
    tags: ['login', 'sign in', 'lockout', 'failed login', 'error', 'credentials'],
    status: 'published',
    content: 'Learn how to resolve common login errors including invalid credentials, locked accounts, and session expiry.',
    sections: [
      {
        heading: 'Account Lockout Policy',
        content: 'Accounts are temporarily locked for 30 minutes after 5 consecutive failed login attempts. You can wait 30 minutes or click "Forgot Password" to unlock immediately.'
      },
      {
        heading: 'Browser Cache and Cookies',
        content: 'Clear your browser cache, disable aggressive ad-blockers, and ensure third-party cookies are permitted for auth.supportsense.ai.'
      }
    ]
  },
  {
    title: 'Updating Your User Profile Information',
    slug: 'updating-user-profile-information',
    category: 'Account Support',
    product: 'SupportSense Web App',
    tags: ['profile', 'name', 'avatar', 'timezone', 'settings'],
    status: 'published',
    content: 'Manage your public name, display avatar, telephone number, and preferred time zone within your profile dashboard.',
    sections: [
      {
        heading: 'Editing Display Details',
        content: 'Navigate to Settings > Profile. Update your display name, company title, and contact phone number, then click "Save Changes" at the bottom of the page.'
      },
      {
        heading: 'Setting Timezone and Language',
        content: 'Select your preferred time zone from the dropdown menu to ensure all activity timestamps and scheduled reports display correctly.'
      }
    ]
  },
  {
    title: 'How to Track an Order Delivery',
    slug: 'how-to-track-an-order-delivery',
    category: 'Orders and Delivery',
    product: 'SupportSense Store',
    tags: ['order', 'track', 'shipping', 'delivery', 'tracking number', 'courier'],
    status: 'published',
    content: 'All physical shipments come with real-time tracking numbers provided by our courier logistics partners.',
    sections: [
      {
        heading: 'Locating Your Tracking Number',
        content: 'Log into your account, visit "Orders", select your order number, and click "Track Shipment" to view live courier transit status.'
      },
      {
        heading: 'Carrier Tracking Delays',
        content: 'Carrier tracking updates can take up to 24 hours after dispatch to reflect initial carrier scans.'
      }
    ]
  },
  {
    title: 'How to Cancel an Order',
    slug: 'how-to-cancel-an-order',
    category: 'Orders and Delivery',
    product: 'SupportSense Store',
    tags: ['cancel', 'order', 'cancellation', 'stop order', 'refund'],
    status: 'published',
    content: 'Orders can only be canceled if they have not yet entered the fulfillment and dispatch stage.',
    sections: [
      {
        heading: 'Order Cancellation Window',
        content: 'You can cancel an order within 60 minutes of placing it by clicking "Cancel Order" on your Order Details page. After 60 minutes, the order is locked for dispatch and must be handled via the return process.'
      },
      {
        heading: 'Refund for Canceled Orders',
        content: 'Upon successful cancellation, an automatic full refund is processed back to your original payment method within 3 to 5 business days.'
      }
    ]
  },
  {
    title: 'Understanding Order Statuses',
    slug: 'understanding-order-statuses',
    category: 'Orders and Delivery',
    product: 'SupportSense Store',
    tags: ['order status', 'processing', 'dispatched', 'fulfilled', 'transit'],
    status: 'published',
    content: 'A comprehensive guide to order lifecycle stages from placement to delivery.',
    sections: [
      {
        heading: 'Status Definitions',
        content: '"Pending" means payment confirmation is in progress. "Processing" means the item is being prepared in the warehouse. "Shipped" means carrier dispatch has occurred, and "Delivered" confirms carrier drop-off.'
      },
      {
        heading: 'On-Hold Status',
        content: 'An "On Hold" status usually indicates an address verification issue or payment review. Check your email for action requests from our logistics team.'
      }
    ]
  },
  {
    title: 'Reporting a Missing or Delayed Delivery',
    slug: 'reporting-a-missing-or-delayed-delivery',
    category: 'Orders and Delivery',
    product: 'SupportSense Store',
    tags: ['missing', 'delayed', 'lost package', 'delivery', 'courier', 'claim'],
    status: 'published',
    content: 'What steps to take if your shipment has exceeded its estimated delivery date or is marked delivered but not received.',
    sections: [
      {
        heading: 'Package Marked Delivered But Not Received',
        content: 'Check with building management, neighbors, or secure drop spots. Wait 24 hours as couriers sometimes pre-scan packages before physical drop-off.'
      },
      {
        heading: 'Filing a Lost Shipment Claim',
        content: 'If the parcel has not arrived 48 hours after the delivery scan, go to Orders > Help > "Report Missing Delivery" to trigger an automated carrier tracer and replacement.'
      }
    ]
  },
  {
    title: 'Downloading Your Billing Invoices and Receipts',
    slug: 'downloading-billing-invoices-and-receipts',
    category: 'Payments and Billing',
    product: 'SupportSense Cloud',
    tags: ['invoice', 'receipt', 'billing', 'tax invoice', 'pdf', 'vat'],
    status: 'published',
    content: 'Access tax-compliant PDF invoices and payment receipts for any previous billing cycle.',
    sections: [
      {
        heading: 'Accessing Billing History',
        content: 'Go to Settings > Billing & Plans > Invoice History. Click the "Download PDF" icon next to any billing date to download your official VAT tax invoice.'
      },
      {
        heading: 'Customizing Billing Information on Invoices',
        content: 'You can add your company tax identification number (EIN, VAT, or GST) under Billing Profile to have it automatically appear on all future generated receipts.'
      }
    ]
  },
  {
    title: 'Updating Your Payment Method',
    slug: 'updating-your-payment-method',
    category: 'Payments and Billing',
    product: 'SupportSense Cloud',
    tags: ['payment method', 'credit card', 'debit card', 'update card', 'billing'],
    status: 'published',
    content: 'Keep your credit card, debit card, or automated bank payment details up to date to prevent subscription interruptions.',
    sections: [
      {
        heading: 'Adding a New Card',
        content: 'Navigate to Settings > Billing > Payment Methods, click "Add Payment Method", enter your card details and billing address, and select "Set as Primary".'
      },
      {
        heading: 'Removing Expired Cards',
        content: 'You can remove old cards by clicking the trash icon next to the expired card, provided at least one valid payment method remains on file.'
      }
    ]
  },
  {
    title: 'Troubleshooting Failed Payment Charges',
    slug: 'troubleshooting-failed-payment-charges',
    category: 'Payments and Billing',
    product: 'SupportSense Cloud',
    tags: ['failed payment', 'declined', 'insufficient funds', 'billing error', 'retry'],
    status: 'published',
    content: 'Understanding why a credit card transaction was declined and how to re-attempt the charge.',
    sections: [
      {
        heading: 'Common Decline Reasons',
        content: 'Common causes include 3D Secure bank verification failures, incorrect postal billing codes, international transaction blocks, or temporary card limits.'
      },
      {
        heading: 'Automatic Retry Schedule',
        content: 'Our billing system automatically retries failed renewal charges after 24, 72, and 120 hours before subscription suspension. You can also trigger an instant retry by clicking "Retry Payment" in Billing Settings.'
      }
    ]
  },
  {
    title: 'Understanding Subscription Charges and Proration',
    slug: 'understanding-subscription-charges-and-proration',
    category: 'Payments and Billing',
    product: 'SupportSense Cloud',
    tags: ['subscription', 'proration', 'upgrade', 'downgrade', 'charge', 'billing cycle'],
    status: 'published',
    content: 'How mid-cycle plan changes, seat additions, and feature upgrades are calculated on your monthly or annual invoice.',
    sections: [
      {
        heading: 'Prorated Billing Explanation',
        content: 'When upgrading your plan mid-cycle, you are only charged the prorated difference for the remaining days in your current billing period.'
      },
      {
        heading: 'Annual Discount Credits',
        content: 'Switching from monthly to annual billing immediately applies an 18% discount and credits unused prepaid monthly days toward the annual plan.'
      }
    ]
  },
  {
    title: 'How to Request a Product Return',
    slug: 'how-to-request-a-product-return',
    category: 'Returns and Refunds',
    product: 'SupportSense Store',
    tags: ['return', 'rma', 'send back', 'return shipping', 'label'],
    status: 'published',
    content: 'Follow our self-service return process to obtain a prepaid return shipping label for eligible physical items.',
    sections: [
      {
        heading: 'Initiating a Return Online',
        content: 'Visit the Returns Center at returns.supportsense.ai, enter your order number and postal code, select the item and return reason, and print the generated prepaid courier label.'
      },
      {
        heading: 'Packaging Instructions',
        content: 'Pack items securely in original packaging with all included cables, accessories, and manuals. Affix the prepaid label to the box and drop off at any authorized courier location.'
      }
    ]
  },
  {
    title: 'Checking Your Refund Status and Timeline',
    slug: 'checking-refund-status-and-timeline',
    category: 'Returns and Refunds',
    product: 'SupportSense Store',
    tags: ['refund status', 'timeline', 'money back', 'bank credit', 'refund'],
    status: 'published',
    content: 'Track when your refund will appear on your financial account statement.',
    sections: [
      {
        heading: 'Warehouse Inspection Period',
        content: 'Once the carrier delivers your return to our fulfillment hub, warehouse inspection and approval takes 2 to 3 business days.'
      },
      {
        heading: 'Bank Processing Timelines',
        content: 'Approved refunds are issued immediately. Depending on your bank or credit card provider, the funds typically appear on your statement within 5 to 10 business days.'
      }
    ]
  },
  {
    title: 'Fictional Demo Refund Eligibility Policy',
    slug: 'fictional-demo-refund-eligibility-policy',
    category: 'Returns and Refunds',
    product: 'SupportSense Store',
    tags: ['refund policy', 'eligibility', '30 days', 'terms', 'demo policy', 'store credit'],
    status: 'published',
    content: 'Sample policy document for the SupportSense demo store. Fictional demo policies are defined for testing purposes only.',
    sections: [
      {
        heading: 'Standard 30-Day Return Window',
        content: 'Physical merchandise may be returned for a full refund within 30 days of the recorded delivery date, provided items are undamaged and in original condition.'
      },
      {
        heading: 'Digital Software and Subscription Refunds',
        content: 'Digital software subscriptions and downloadable API keys are eligible for a full refund within 14 days of initial purchase if usage does not exceed 100 API queries.'
      },
      {
        heading: 'Non-Refundable Items',
        content: 'Gift cards, custom engraved hardware, and consumable items that have been unsealed are strictly non-refundable.'
      }
    ]
  },
  {
    title: 'Troubleshooting Wi-Fi and Bluetooth Connectivity',
    slug: 'troubleshooting-wifi-and-bluetooth-connectivity',
    category: 'Product Troubleshooting',
    product: 'SupportSense IoT Hub',
    tags: ['connectivity', 'wifi', 'bluetooth', 'pairing', 'offline', 'iot'],
    status: 'published',
    content: 'Resolve device pairing failures, dropped Wi-Fi connections, and network discovery issues on the SupportSense IoT Hub.',
    sections: [
      {
        heading: 'Resetting Network Configurations',
        content: 'Hold the device reset button for 7 seconds until the LED flashes amber. Open the SupportSense Mobile App, select "Pair Device", and reconnect to your 2.4 GHz Wi-Fi network.'
      },
      {
        heading: 'Router and Frequency Compatibility',
        content: 'SupportSense IoT Hub requires a standard 2.4 GHz Wi-Fi band. If you are using a dual-band mesh router, ensure 2.4 GHz broadcast is enabled and AP isolation is disabled.'
      }
    ]
  },
  {
    title: 'Updating Device Firmware and Software',
    slug: 'updating-device-firmware-and-software',
    category: 'Product Troubleshooting',
    product: 'SupportSense IoT Hub',
    tags: ['firmware', 'software update', 'ota', 'upgrade', 'patch'],
    status: 'published',
    content: 'How to perform Over-The-Air (OTA) firmware updates to keep your device secure and optimized.',
    sections: [
      {
        heading: 'Triggering an OTA Firmware Update',
        content: 'In the SupportSense App, select your Hub, go to Device Settings > Firmware, and tap "Check for Updates". If a newer version is available, tap "Install Update" while keeping the device connected to power.'
      },
      {
        heading: 'Update Duration and Precautions',
        content: 'Firmware updates take approximately 4 to 6 minutes. Do not disconnect the power cable or reboot the router while the status LED is pulsating blue.'
      }
    ]
  },
  {
    title: 'Resolving Common Device LED Status Codes',
    slug: 'resolving-common-device-led-status-codes',
    category: 'Product Troubleshooting',
    product: 'SupportSense IoT Hub',
    tags: ['led', 'error codes', 'blinking red', 'troubleshooting', 'amber light'],
    status: 'published',
    content: 'Reference guide for interpreting hardware LED indicator colors and error states.',
    sections: [
      {
        heading: 'Solid Red or Flashing Red LED',
        content: 'A solid red LED indicates hardware self-test failure. Power cycle the device by unplugging for 30 seconds. A flashing red LED indicates lost cloud connection.'
      },
      {
        heading: 'Flashing Yellow or Amber LED',
        content: 'A flashing yellow LED signifies that the device is in pairing / setup mode and awaiting connection from the mobile application.'
      },
      {
        heading: 'Solid Green LED',
        content: 'A solid green LED confirms normal online operation and active cloud synchronization.'
      }
    ]
  },
  {
    title: 'How to Contact Official Customer Support',
    slug: 'how-to-contact-official-customer-support',
    category: 'Account Support',
    product: 'SupportSense Cloud',
    tags: ['contact', 'support team', 'human agent', 'ticket', 'phone', 'help desk'],
    status: 'published',
    content: 'When automated self-service cannot resolve your inquiry, connect directly with our human customer support specialists.',
    sections: [
      {
        heading: 'Live Chat and Ticket Submission',
        content: 'Submit a high-priority support ticket at support.supportsense.ai/tickets or open the Live Chat widget at the bottom right corner of the dashboard Monday through Friday 9 AM to 8 PM EST.'
      },
      {
        heading: 'Priority Escalation for Enterprise Customers',
        content: 'Enterprise tier customers have access to 24/7 dedicated telephone support via the private hotline listed on their organization billing dashboard.'
      }
    ]
  },
  // Sample Draft and Archived articles to test exclusion filters:
  {
    title: 'Draft Article: Internal Test Features',
    slug: 'draft-internal-test-features',
    category: 'Product Troubleshooting',
    product: 'SupportSense Cloud',
    tags: ['internal', 'draft', 'testing'],
    status: 'draft',
    content: 'This is an unapproved draft article. It should never appear in public search or chat results.',
    sections: [
      {
        heading: 'Internal Notes',
        content: 'Draft internal testing only.'
      }
    ]
  },
  {
    title: 'Archived Article: Legacy USB Dongle Setup',
    slug: 'archived-legacy-usb-dongle-setup',
    category: 'Product Troubleshooting',
    product: 'SupportSense IoT Hub',
    tags: ['archived', 'deprecated', 'usb dongle'],
    status: 'archived',
    content: 'This hardware was discontinued in 2021. It should never be returned in public search or chatbot results.',
    sections: [
      {
        heading: 'Legacy Support Notice',
        content: 'This product is no longer supported.'
      }
    ]
  }
];

module.exports = sampleArticles;

