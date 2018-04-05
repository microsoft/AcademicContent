![](media/image1.png)

# Mobile Development

Optimization of the performance and user experience of mobile apps has
increased the demand for full-featured, server-side mobile app
solutions. These solutions include mobile-accessible cloud storage,
authentication, and push notifications. Azure Mobile Apps is a service
suite providing baseline features like SQL Databases, mobile push
notifications, brand-name authentication via Facebook and Twitter for
consumer apps, and Azure Active Directory(AAD) for enterprise apps.
Access to these features is condensed into the Azure Mobile SDK, an API
used by mobile developers to access the Azure cloud feature set,
including local/remote data sync. Serverless nanoservices that
instantiate on-demand are becoming more common as mobile back-ends and
Azure Functions provide these services that are easily implemented in
mobile dev architectures.

- [Mobile App Server-Side Solutions](#mobile-app-server-side-solutions)  
    - [Cloud Storage](#cloud-storage)  
    - [Offline Data Sync](#offline-data-sync)  
    - [Authentication](#authentication)  
    - [Push Notifications](#push-notifications)  
- [Mobile App Services](#mobile-app-services)
- [Serverless Mobile Back Ends](#serverless-mobile-back-ends)

## Mobile App Server-Side Solutions

Azure Mobile Apps is a suite of services that provide back-end support
to native and cross-platform mobile apps. It offers features important
to mobile app developers including:

-   [Cloud Storage](#cloud-storage)  
-   [Offline Data Sync](#offline-data-sync)  
-   [Authentication](#authentication)  
-   [Push Notifications](#push-notifications)  

Developers can take advantage of Azure Mobile Apps using the Azure SDK
for native iOS, Android, Windows, or cross-platform Cordova or Xamarin
apps.

[Learn More](https://docs.microsoft.com/en-us/azure/app-service-mobile/app-service-mobile-value-prop)  
[Get Started](https://docs.microsoft.com/en-us/azure/app-service-mobile/app-service-mobile-xamarin-forms-get-started-offline-data)  


### Cloud Storage

Mobile apps need server-side virtual storage with cloud databases and
tables that can be instantiated and destroyed on demand. Azure SQL
Databases provide cloud storage that is easy to set up and low
maintenance, requiring no administration of physical disk, partitions,
or logging. They have automatic backups and software updates, and
automatic tuning and threat detection.

A feature called Easy Tables provides a rapid app development approach
by automatically creating columns in a table as data is inserted. The
table automatically adds columns to itself based upon data inserted into
the table using the Azure SDK.

The Azure SDK provides a straightforward way to create SQL Database
table references from within a mobile app and conduct CRUD transactions.
Azure SDK meets your mobile app’s data access needs by querying,
filtering, sorting, and syncing data to a local database, such as
SQLite. Use the Azure SDK in your mobile app or server-side code to
obtain references to your app’s Azure SQL Database URL and tables.
Execute CRUD transactions against your tables, and filter and sort by
row, column, and id. Access to Azure tables can also be achieved using
Visual Studio Mobile Center (VSMC).

[Learn More](https://docs.microsoft.com/en-us/azure/sql-database/)  
[Get Started](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-get-started-portal)  

### Offline Data Sync

Sync data local-to-cloud using a SQLite database, an Azure SQL Database,
and the Azure SDK. In your mobile app, use a local SQLite database and
bind it to your Azure cloud data source. All writes go to the local
SQLite database. Sync the databases with push and pull methods. Data is
sent to the Azure SQL Database only when explicitly synced using the
SDK’s async methods. Remote data sync from multiple client apps raises
the risk of conflicts. Handle sync errors using a try/catch exception
handler or by implementing a sync handler interface.

[Learn More](https://docs.microsoft.com/en-us/azure/app-service-mobile/app-service-mobile-offline-data-sync)  
[Get Started](https://docs.microsoft.com/en-us/azure/app-service-mobile/app-service-mobile-xamarin-forms-get-started-offline-data)

### Authentication

Azure Authentication integrates with Azure Active Directory (AD) and
third parties such as Facebook, Google, MS Account, and Twitter.

Using standard OAuth workflow, the mobile app retrieves an
authentication token from an authentication provider to access a
protected service. This token is used to create an identity for the
mobile app which is passed to the target mobile service. The acceptance
of this identity finalizes the authentication. The mobile service then
executes the desired function and returns requested values (if any) to
the calling mobile app.

[Learn More](https://docs.microsoft.com/en-us/azure/app-service-mobile/app-service-mobile-auth)  
[Get Started](https://docs.microsoft.com/en-us/azure/app-service-mobile/app-service-mobile-how-to-configure-twitter-authentication)

### Push Notifications

Due to the secure and proprietary nature of mobile push notifications,
OS providers each utilize their own Push Notification Service (PNS).
Cross-platform development must integrate with two or more services
which can become unwieldy. Azure Notification Hubs provides a single
notification hub for server-side notification generators. Provide Azure
Notification Hubs with access to the platform-specific PNS then push
messages to the hub using platform-specific methods in your mobile app,
as specified in the Azure SDK.

Use Azure Notifications Hubs to broadcast notifications by user, device,
or platform, in real-time or scheduled. The hub service scales to
millions of devices and supports all major push platforms including iOS,
Android, Windows, Kindle, and Baidu.

[Learn More](https://docs.microsoft.com/en-us/azure/notification-hubs/notification-hubs-push-notification-overview)  
[Get Started](https://docs.microsoft.com/en-us/azure/notification-hubs/notification-hubs-android-push-notification-google-fcm-get-started)  

## Mobile App Services

Containers like Docker can be created and populated with services for
consumption by mobile apps. Azure Mobile Apps is a full-featured service
suite custom-made for mobile development, providing containers, built-in
and from-scratch services, access to data sources, maintained and
administered maintenance-free on the Azure platform.

[Learn More](https://docs.microsoft.com/en-us/azure/app-service-mobile/app-service-mobile-value-prop)  
[Get Started](https://docs.microsoft.com/en-us/azure/app-service-mobile/app-service-mobile-ios-get-started)

## Serverless Mobile Back Ends

Azure Functions are small, event-driven pieces of code hosted inside
on-demand, self-administering containers. Azure Functions provide a
trigger, input, and output model. The most basic trigger or event, from
a mobile app is an HTTP call which can pass and return JSON. Functions
can have many other triggers besides HTTP calls. Functions can be driven
by data events, such as the addition of a new row to a table or a new
blob to a container. Functions are driven by actions within a queue, or
on a schedule, or by a GitHub webhook request.

The Azure Function’s Input and Output elements can consist of various
server-side resources such as table and blob storage. Functions can be
coded in C\#, F\#, or JavaScript and are cost-effective as they only
consume billable resources while running.

[Learn More](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-mobile-apps)  
[Get Started](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function)
