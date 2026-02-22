## Firebase usage monitoring/alerting, and overusage prevention
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

**Q**: Speaking of the limitation: The Firebase console and monitoring dashboards are not always real-time;
usage data can lag by several hours to 24 hours.

Can I proactively query current usage metrics, and consider them a better option for preventing _Hard Stop_?

**A**: The _24-hour lag_ here refers to the _Billing/Usage Dashboard_ in the _Firebase console_.
**Google Cloud Monitoring** (which power those dashboards) are sampled much more frequently:

* **Sampling Rate**: Most Firebase metrics (like _Firestore reads_ or _Realtime Database bytes_) are **sampled every 1 minute**.
* **Visibility Delay**: Once sampled, data typically becomes visible in the _Monitoring API_ **within 4 minutes**.

These metrics are a **significantly better option** for preventing a _Hard Stop_.
