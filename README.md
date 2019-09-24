# InvoiceMan

This demonstrates how to read the list of invoices from an Azure subscription

InvoiceMan can be deployed outside the subscription where invoices are read since it uses a Service Principal to retrieve invoices.

The list of invoices retrieved are [limited to Azure Web-Direct subscriptions](https://docs.microsoft.com/en-us/javascript/api/azure-arm-billing/invoices?view=azure-node-latest#list-object-)

## Running Locally

Download the code and dependencies

```
git clone git@github.com:jasoncabot-ms/invoiceman.git
npm install
```

Ensure you have set up a service principal and entered `ClientID` and `ClientSecret` in the application settings

Create a `local.settings.json` file in the root of the project with appropriate values, for example:

```
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsStorage": "{AzureWebJobsStorage}",
    "TenantDomain": "******",
    "SubscriptionID": "******",
    "ClientID": "******",
    "ClientSecret": "******"
  }
}
```

Start the development server

```
npm start
```

Navigate to http://localhost:7071/api/GetInvoiceStatus

This will attempt to read the list of invoices in the `SubscriptionID` authenticated in the `TenantDomain` using the Service Principal `ClientID` and `ClientSecret`

## Running in Production

The following commands will create a production build

```
git clone git@github.com:jasoncabot-ms/invoiceman.git
npm install
npm package
```

This will output the following structure which can be uploaded to a function app in **Azure Functions**

```
./dist/
  └── GetInvoiceStatus
      ├── function.json
      └── index.js
```

## Subscription Setup

InvoiceMan consists of two (or more) subscriptions. 

The first owns the resources used to **read** the invoice data from multiple other subscriptions and is known as the **Reader**

The second is the subscription that **owns the invoices** that will be read and is known as the **Generator**

In order for the Reader to access the invoices in the Generator, you must create a **Service Principal** associated with the **Billing Reader** role inside the Generator subscription.

### Create a Service Principal with access to Invoices

* Navigate to [the Azure Portal](https://portal.azure.com)
* [Azure Active Directory ➝ App registrations ➝ New registration](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps)

* [Cost Management + Billing ➝ Select subscription ➝ Access control (IAM) ➝ Role assignments ➝ Add (role assignment)](https://portal.azure.com/#blade/Microsoft_Azure_Billing/BillingMenuBlade/Subscriptions/id/)
    * Role: **Billing Reader**
    * Assign access to: **Azure AD User, group, or service principal**
    * Select: **Start typing and select the name of the previously created principal**
*  [Cost Management + Billing ➝ Select subscription ➝ Invoices ➝ Access to invoice ➝ On](https://portal.azure.com/#blade/Microsoft_Azure_Billing/BillingMenuBlade/Subscriptions/id/)

    > This allows users/groups with subscription-level access to download invoices. 
    > 
    > This will allow the service principal to view personal information (name, email, and addresses) contained inside the invoices. [View the privacy statement](https://privacy.microsoft.com/en-gb/privacystatement).
* [Azure Active Directory ➝ App registrations ➝ Certificates & secrets ➝ New client secret](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) 

