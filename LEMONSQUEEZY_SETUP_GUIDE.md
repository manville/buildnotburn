
# Lemon Squeezy & Firebase Setup Guide for BuildNotBurn

Follow these steps to configure your Lemon Squeezy and Firebase accounts to work seamlessly with your BuildNotBurn application.

---

## 1. Lemon Squeezy: Create Your Products and Variants

You need to create three products in your Lemon Squeezy store: two paid subscription plans (which include the guide) and one free newsletter signup.

### Step 1: Create the "Builder" Subscription Plan

1.  Log in to your Lemon Squeezy dashboard.
2.  Go to **Store > Products**.
3.  Click **New Product**.
4.  **Name**: `Builder Plan`
5.  **Pricing**: Select `Subscription`.
6.  **Files**: Upload your "Field Guide" and "Daily Worksheet" PDFs here. They will be delivered automatically to customers after purchase.
7.  Click **Save Product**.

Now, add the pricing variants:

1.  On the product page, find the **Variants** section and click **Add Variant**.
2.  **Monthly Variant**:
    *   **Name**: `Monthly`
    *   **Price**: `$8.00` (or your desired price)
    *   **Billing Cycle**: `Month`
    *   Click **Publish variant**.
    *   After publishing, click the **three dots (...)** next to the variant and **copy the Variant ID**. You will need this.
1133255
3.  **Annual Variant**:
    *   Click **Add Variant** again.
    *   **Name**: `Annually`
    *   **Price**: `$80.00` (or your desired price)
    *   **Billing Cycle**: `Year`
    *   Click **Publish variant**.
    *   Copy the **Variant ID** for this annual variant.
1133271
---

### Step 2: Create the "Architect" Subscription Plan

Repeat the process from Step 1 for the Architect plan.

1.  Create a new product named `Architect Plan`.
2.  Make it a `Subscription` and upload the same Guide and Worksheet PDFs to the **Files** section.
3.  **Monthly Variant**:
    *   **Name**: `Monthly`
    *   **Price**: `$15.00`
    *   **Billing Cycle**: `Month`
    *   Publish and copy the **Variant ID**.
1133255
4.  **Annual Variant**:
    *   **Name**: `Annually`
    *   **Price**: `$150.00`
    *   **Billing Cycle**: `Year`
    *   Publish and copy the **Variant ID**.
1133271
---

### Step 3: Create the "Newsletter" Free Product

This product will be used to capture emails for your newsletter.

1.  Create a new product named `BuildNotBurn Newsletter` (or similar).
2.  **Pricing**: Keep it as a **Single payment**.
3.  **Price**: Set the price to **$0.00**. This is critical.
4.  Click **Publish Product**.
5.  On the product page, find the default variant, click the **three dots (...)**, and copy the **Variant ID**.
1133276
---

## 2. Lemon Squeezy: Get Your API Key and Store ID

You need your API Key to create checkouts and your Store ID to link them to your store.

1.  In your Lemon Squeezy dashboard, go to **Settings > API**.
2.  Click **New API Key**.
3.  Give it a name (e.g., "BuildNotBurn App") and click **Create**.
4.  **Copy the API key immediately.** It will only be shown once.
5.  Now, go to **Settings > Stores**.
6.  You will see your store listed. The **Store ID** is the number shown next to the store name (e.g., `Store #12345`). Copy this number.

---

## 3. Lemon Squeezy: Create the Webhook

The webhook is how Lemon Squeezy tells your app that a payment was successful.

1.  In your Lemon Squeezy dashboard, go to **Settings > Webhooks**.
2.  Click **New Webhook**.
3.  **Callback URL**: You will need to enter the URL where your app is hosted, followed by `/api/lemonsqueezy/webhook`. For example:
    `https://your-production-app-url.com/api/lemonsqueezy/webhook`
4.  **Events**: Check the boxes for `subscription_created` and `subscription_updated`.
5.  **Signing Secret**: After you create the webhook, Lemon Squeezy will show you a **Signing Secret**. It looks like `whsec_...`. **Copy this value immediately.** It is only shown once.
6.  Click **Save Webhook**.
BuildM4nvill3NotBurn
---

## 4. Firebase: Get Service Account Credentials

Your webhook needs to securely communicate with your Firestore database. To do this, you need a "service account," which is a special credential for server-to-server communication.

1.  Open the [Google Cloud Console](https://console.cloud.google.com/).
2.  Select your Firebase project from the project dropdown at the top of the page.
3.  In the search bar, type **"IAM & Admin"** and select **"IAM & Admin > Service Accounts"**.
4.  Find the service account with the role **"Firebase Admin SDK Administrator Service Agent"**. Its email will look something like `firebase-adminsdk-...@...gserviceaccount.com`.
5.  Click the **three-dot menu (⋮)** on the right side of that service account and select **"Manage keys"**.
6.  Click **"Add Key"** > **"Create new key"**.
7.  Choose **JSON** as the key type and click **"Create"**.
8.  A JSON file will be downloaded to your computer. **This file is your `GOOGLE_APPLICATION_CREDENTIALS`. Guard it like a password.**

---

## 5. Update Your Application's Environment File

Now, open the `.env` file in your project and fill in all the values you just collected.

```env
# .env

# === Lemon Squeezy ===

# API Key (for creating checkouts)
# Found in: Settings > API
LEMONSQUEEZY_API_KEY="REPLACE_WITH_YOUR_API_KEY"

# Your Store ID
# Found in: Settings > Stores
LEMONSQUEEZY_STORE_ID="REPLACE_WITH_YOUR_STORE_ID"

# Webhook Secret (for verifying incoming requests)
# Found in: Settings > Webhooks (after creating one)
LEMONSQUEEZY_WEBHOOK_SECRET="REPLACE_WITH_YOUR_WEBHOOK_SIGNING_SECRET"

# --- Product Variant IDs ---
# These are found on each Product's page in your Lemon Squeezy store.

# Free Newsletter Product
NEXT_PUBLIC_LEMONSQUEEZY_NEWSLETTER_VARIANT_ID="REPLACE_WITH_YOUR_NEWSLETTER_VARIANT_ID"

# Paid Plans
NEXT_PUBLIC_LEMONSQUEEZY_BUILDER_MONTHLY_VARIANT_ID="REPLACE_WITH_BUILDER_MONTHLY_VARIANT_ID"
NEXT_PUBLIC_LEMONSQUEEZY_BUILDER_ANNUALLY_VARIANT_ID="REPLACE_WITH_BUILDer_ANNUALLY_VARIANT_ID"
NEXT_PUBLIC_LEMONSQUEEZY_ARCHITECT_MONTHLY_VARIANT_ID="REPLACE_WITH_ARCHITECT_MONTHLY_VARIANT_ID"
NEXT_PUBLIC_LEMONSQUEEZY_ARCHITECT_ANNUALLY_VARIANT_ID="REPLACE_WITH_ARCHITECT_ANNUALLY_VARIANT_ID"

# === Firebase ===

# Firebase Service Account JSON (for server-side webhook)
# This is the entire content of the JSON file you downloaded from Google Cloud.
# It needs to be a single-line string. You can use an online "JSON to single line" converter.
# Example: '{"type": "service_account", "project_id": "...", ...}'
GOOGLE_APPLICATION_CREDENTIALS='REPLACE_WITH_YOUR_SINGLE_LINE_JSON_CREDENTIALS'

```

After you have completed these steps, your application will be fully connected and ready for production.
