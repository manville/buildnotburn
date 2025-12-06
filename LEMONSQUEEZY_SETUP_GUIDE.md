
# Lemon Squeezy Setup Guide for BuildNotBurn

Follow these steps to configure your Lemon Squeezy account to work seamlessly with your BuildNotBurn application. You will need to create products, find their variant IDs, and set up a webhook.

---

## 1. Create Your Products and Variants

You need to create three products in your Lemon Squeezy store: two paid subscription plans and one free newsletter signup.

### Step 1: Create the "Builder" Subscription Plan

1.  Log in to your Lemon Squeezy dashboard.
2.  Go to **Store > Products**.
3.  Click **New Product**.
4.  **Name**: `Builder Plan`
5.  **Pricing**: Select `Subscription`.
6.  **Files (Optional)**: If you have the guide PDF, you can upload it here. It will be delivered automatically to customers after purchase.
7.  Click **Save Product**.

Now, add the pricing variants:

1.  On the product page, find the **Variants** section and click **Add Variant**.
2.  **Monthly Variant**:
    *   **Name**: `Monthly`
    *   **Price**: `$5.00` (or your desired price)
    *   **Billing Cycle**: `Month`
    *   Click **Publish variant**.
    *   After publishing, click the **three dots (...)** next to the variant and **copy the Variant ID**. You will need this.

3.  **Annual Variant**:
    *   Click **Add Variant** again.
    *   **Name**: `Annually`
    *   **Price**: `$50.00` (or your desired price)
    *   **Billing Cycle**: `Year`
    *   Click **Publish variant**.
    *   Copy the **Variant ID** for this annual variant.

---

### Step 2: Create the "Architect" Subscription Plan

Repeat the process from Step 1 for the Architect plan.

1.  Create a new product named `Architect Plan`.
2.  Make it a `Subscription`.
3.  **Monthly Variant**:
    *   **Name**: `Monthly`
    *   **Price**: `$10.00`
    *   **Billing Cycle**: `Month`
    *   Publish and copy the **Variant ID**.
4.  **Annual Variant**:
    *   **Name**: `Annually`
    *   **Price**: `$100.00`
    *   **Billing Cycle**: `Year`
    *   Publish and copy the **Variant ID**.

---

### Step 3: Create the "Newsletter" Free Product

This product will be used to capture emails for your newsletter.

1.  Create a new product named `BuildNotBurn Newsletter` (or similar).
2.  **Pricing**: Keep it as a **Single payment**.
3.  **Price**: Set the price to **$0.00**. This is critical.
4.  Click **Publish Product**.
5.  On the product page, find the default variant, click the **three dots (...)**, and copy the **Variant ID**.

---

## 2. Create the Webhook

The webhook is how Lemon Squeezy tells your app that a payment was successful.

1.  In your Lemon Squeezy dashboard, go to **Settings > Webhooks**.
2.  Click **New Webhook**.
3.  **Callback URL**: You will need to enter the URL where your app is hosted, followed by `/api/lemonsqueezy/webhook`. For example:
    `https://your-production-app-url.com/api/lemonsqueezy/webhook`
4.  **Events**: Check the boxes for `subscription_created` and `subscription_updated`.
5.  **Signing Secret**: After you create the webhook, Lemon Squeezy will show you a **Signing Secret**. It looks like `whsec_...`. **Copy this value immediately.** It is only shown once.
6.  Click **Save Webhook**.

---

## 3. Find Your API Key and Store ID

1.  **API Key**:
    *   Go to **Settings > API**.
    *   Click **New API Key**. Give it a name like "BuildNotBurn App".
    *   Copy the generated API key.

2.  **Store ID**:
    *   Go to **Settings > Stores**.
    *   Click on your store name.
    *   You will see the Store ID listed. Copy it.

---

## 4. Update Your Application's Environment File

Now, open the `.env` file in your project and fill in all the values you just collected.

```env
# .env

# Lemon Squeezy API Key (for creating checkouts)
# Found in: Settings > API
LEMONSQUEEZY_API_KEY="REPLACE_WITH_YOUR_API_KEY"

# Your Lemon Squeezy Store ID
# Found in: Settings > Stores
LEMONSQUEEZY_STORE_ID="REPLACE_WITH_YOUR_STORE_ID"

# Lemon Squeezy Webhook Secret (for verifying incoming requests)
# Found in: Settings > Webhooks (after creating one)
LEMONSQUEEZY_WEBHOOK_SECRET="REPLACE_WITH_YOUR_WEBHOOK_SIGNING_SECRET"

# --- Product Variant IDs ---
# These are found on each Product's page in your Lemon Squeezy store.

# Free Newsletter Product
NEXT_PUBLIC_LEMONSQUEEZY_NEWSLETTER_VARIANT_ID="REPLACE_WITH_YOUR_NEWSLETTER_VARIANT_ID"

# Paid Plans
NEXT_PUBLIC_LEMONSQUEEZY_BUILDER_MONTHLY_VARIANT_ID="REPLACE_WITH_BUILDER_MONTHLY_VARIANT_ID"
NEXT_PUBLIC_LEMONSQUEEZY_BUILDER_ANNUALLY_VARIANT_ID="REPLACE_WITH_BUILDER_ANNUALLY_VARIANT_ID"
NEXT_PUBLIC_LEMONSQUEEZY_ARCHITECT_MONTHLY_VARIANT_ID="REPLACE_WITH_ARCHITECT_MONTHLY_VARIANT_ID"
NEXT_PUBLIC_LEMONSQUEEZY_ARCHITECT_ANNUALLY_VARIANT_ID="REPLACE_WITH_ARCHITECT_ANNUALLY_VARIANT_ID"

# Note: You also need to add your Firebase config and Google Application Credentials for the webhook to write to Firestore.
# GOOGLE_APPLICATION_CREDENTIALS="..."
```

Finally, you will need to update `src/components/buildnotburn/Paywall.tsx` with the real variant IDs you just got. I have already updated the `.env` file with placeholders, but you also need to make sure the Paywall component is using the correct environment variable names.

After you have completed these steps, your application will be fully connected to Lemon Squeezy.
