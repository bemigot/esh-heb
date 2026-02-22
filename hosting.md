## GitHub Actions > Firebase deployment setup

1. Create Fibase project - done - [bihebr2](https://console.firebase.google.com/project/bihebr2/settings/general)
2. Obtain "secret" and configure that for use in a repository (project?) level action
   * Go to [**Project Settings** > **Service Account** tab](https://console.firebase.google.com/project/bihebr2/settings/serviceaccounts/adminsdk)
   * Push "Generate new private key" button, downlaod and save the generated JSON file in a safe place - done - this project uses `./.secret/
   * You may notice "Admin SDK configuration snippet" (Node.js/Java/Python/Go variants) - see [below](#firebase-admin-sdk-sample) ifyou wonder what it is.
   * Give GitHub permission to talk to Firebase:
     * In your GitHub repository, go to [**Settings** > **Secrets and variables** > **Actions**](https://github.com/bemigot/esh-heb/settings/secrets/actions)
     * Create a New repository secret.
     * Name it `FIREBASE_SERVICE_ACCOUNT`
     * Paste the entire contents of that JSON file you downloaded into the "Value" field.
   * TBD

## Firebase usage monitoring/alerting, and overusage prevention

### "Instant" **notifications**

**Q**: my app is hosted on Firebase (free-tier Spark plan). Can I get notifications on excessive traffic use (e.g. 50% of monthly cap used) delivered to my Android phone, e.g. in Telegram app?

**A**: Yes, you can receive these notifications on your Android phone via Telegram, though it requires a bit of setup.

While the Firebase Spark plan is a no-cost tier that automatically stops services when limits are reached,
it does not offer built-in "percentage-of-quota" alerts directly to Telegram.

To achieve this, you must use Google Cloud Monitoring and a Telegram Bot.

1. Set Up _Google Cloud Monitoring_. Since every Firebase project is also a _Google Cloud_ **project**,
   you can use more advanced monitoring tools:
   * Create an _Alerting Policy_: Go to the _Google Cloud Console_ **Alerting** page and create a _policy_.
   * Select _Metrics_: Choose the relevant traffic metric for your app
     (e.g., Hosting/Network/Sent Bytes or Realtime Database/Downloads).
   * Set **Thresholds**: Configure the alert to trigger when usage hits your specific target
     (e.g., 5GB if your monthly cap is 10GB).

2. Bridge to Telegram. You have two primary ways to bridge Google Cloud Monitoring > Telegram.
   * Option A: Using Webhooks (Easier)
        * Create a Telegram Bot using BotFather and get your API Token.
        * Use a service like **Zapier** or **Make** (formerly **Integromat**) to create a "Webhook to Telegram" workflow.
        * In Google Cloud Monitoring, add a Webhook Notification Channel using the URL provided by Zapier/Make.
   * Option B: Using **Cloud Functions** (Most Integrated)
        * Create a _Telegram Bot_ as described above.
        * Write a simple Firebase **Cloud Function** that listens to a Google Cloud _Pub/Sub topic_.
        * Configure your Google Cloud Alert to send notifications to that _Pub/Sub topic_.
        * When triggered, the **Cloud Function** sends the alert details to your Telegram chat using the _Telegram Bot API_.

Important Constraints for _Spark Plan_ (free tier)
* **No Billing Alerts**: Standard "Budget Alerts" usually require a billing account (Blaze plan),
  even if you stay within the free tier. Stick to Metric-based alerts in Cloud Monitoring for the Spark plan.
* **Data Lag**: The Firebase console and monitoring dashboards are not always real-time;
  usage data can lag by several hours to 24 hours.
* **Hard Stop**: Remember that on the Spark plan, if you hit 100%,
  services like Firestore or Hosting will simply return a "Resource Exhausted" error until the next cycle.

### Resource exhaustion prevention

**Q**: Speaking of the limitation: The Firebase console and monitoring dashboards are not always real-time;
usage data can lag by several hours to 24 hours.

Can I proactively query current usage metrics, and consider them a better option for preventing _Hard Stop_?

**A**: The _24-hour lag_ here refers to the _Billing/Usage Dashboard_ in the _Firebase console_.
**Google Cloud Monitoring** (which power those dashboards) are sampled much more frequently:

* **Sampling Rate**: Most Firebase metrics (like _Firestore reads_ or _Realtime Database bytes_) are **sampled every 1 minute**.
* **Visibility Delay**: Once sampled, data typically becomes visible in the _Monitoring API_ **within 4 minutes**.

These metrics are a **significantly better option** for preventing a _Hard Stop_.

#### Proactive Querying via API
You can proactively query these metrics programmatically using the Cloud Monitoring API (v3).
This allows you to build your own "pre-alert" system:
* List Metrics: Use the API to fetch timeSeries.list for specific Firebase resources.
* Key Metrics to Watch:
        Cloud Firestore: `firestore.googleapis.com`
        Realtime Database: `firebasedatabase.googleapis.com`
        Hosting: `serviceruntime.googleapis.com`

#### Proactive Protection Strategies
Since the Spark plan's hard stop is absolute, you can use these metrics to take defensive action before the limit is hit:
* Threshold-Based Features: Use a Firebase **Cloud Function** triggered by a _Cloud Monitoring alert_ to toggle a _Remote Config flag_.
* Circuit Breaking: When your queried metrics show you are at 90% of the daily/monthly free limit, your app can read the _Remote Config flag_ and enter a "low-bandwidth mode" (e.g., disabling image loading or non-essential writes) to stretch the remaining quota.
* Rate Limiting: For critical functions, implement your own internal counters or rate limiting to guard against spikes before the official Firebase counters catch up.

### Firebase Admin SDK sample

The Firebase Admin SDK configuration snippet is used to initialize
the Admin SDK in your own secure server-side or backend environments,
granting it administrative privileges to interact with Firebase services.

This snippet, available from the Firebase Console's **Project settings**
under the "Service accounts" tab, contains the necessary credentials
to bypass security rules and perform privileged tasks.

The Admin SDK, initialized with this configuration, is used for tasks
that require full control and are not safe to perform on the client-side:

* Bypassing Security Rules: The Admin SDK operates with full read/write access
  to your _Realtime Database_ and _Cloud Firestore_,
  ignoring the security rules enforced on client applications.
* User Management: Programmatically manage users
  (create, update, delete, retrieve data, change passwords/emails) without _client-side rate limits_.
* Custom Authentication: Create custom tokens for users who authenticate via external or legacy systems,
  allowing them to securely sign in to Firebase services.
* ID Token Verification: Securely verify Firebase ID tokens on your server
  to identify the currently signed-in user and run server-side logic on their behalf.
* Server-side Logic and Data Processing: Perform administrative operations like data migrations,
  bulk data management, or running background jobs (e.g., in Cloud Functions, Cloud Run, App Engine)
  that need elevated privileges.
* Role-Based Access Control (RBAC): Set custom user claims to define user roles
  (e.g., 'admin', 'teacher') which can then be enforced by client-side security rules.
* Sending _FCM Messages_: Programmatically send **Firebase Cloud Messaging** (_FCM_)
  messages (push notifications) to client devices using a simple alternative to server protocols.

#### Where the snippet is used

The configuration snippet is specifically for trusted environments, such as:
* Your own backend servers
* Managed Google Cloud environments like **Cloud Functions** or **Cloud Run**

It is **never** meant to be included in **client-side** applications,
as this would expose your project's administrative credentials to end-users
and create a major security vulnerability.
