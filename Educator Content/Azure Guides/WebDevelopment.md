![](media/image1.png)
# Web Development

Cloud offers a lot of benefits to web development including flexibility,
elasticity, resilience, automation and low capital cost. Web
applications can be optimized using tactics such as horizontal and
vertical scaling as well as having content distributed closer to users.

In this guide, you will learn how Microsoft Azure services enables
components of web projects including persistence (Azure Storage),
application deployment (Azure App Service), faster content delivery
(Azure Content Delivery Network), resilience (Azure Load Balancer) and
scalable event-driven serverless functions (Azure Functions).

-   [Deploying and Maintaining Applications](#deploying-and-maintaining-applications)  
-   [Working with Databases](#working-with-databases)  
    - [Cosmos DB](#cosmos-db)
    - [Azure SQL](#azure-sql)
    - [Azure Storage](#azure-storage)
-   [Web Content Delivery](#web-content-delivery)
-   [Building Resilient Web Apps](#building-resilient-web-apps)

## Deploying and Maintaining Applications

Most developers would rather focus on creating web sites than setting up
their production, staging and development environment. IT Operations can
be a tricky and time-consuming task. Maintenance is an even larger
problem for developers because un-patched distributions, outdated
libraries with 0-day exploits can lead to attacks, underperformance,
increased downtime and subpar user experience.

Azure App Service solves many if not all of these problems by providing
software developers with an application ready environment for virtually
all platforms including: Java, Node.js, PHP, Python and .NET. Azure App
Services global datacenter network, security and compliance level are
suitable for anything from student projects to enterprise applications.
With a wide-range of options for pre-built apps, solutions, APIs and
recipes from Azure Marketplace, some developers won't have to code
anything at all, and when they need to code, they can use rich
development tooling provided by Azure App Services including continuous
integration, Visual Studio IDE, in-browser editor and live-site
debugging.

[Learn More](https://docs.microsoft.com/en-us/azure/app-service-web/)  
[Get Started](https://docs.microsoft.com/en-us/azure/app-service-web/app-service-web-tutorial-nodejs-mongodb-app)

## Working with Databases

Microsoft Azure Databases will allow developers to use a managed
databased (database-as-a-service) and pick from the most popular open
source databases such as PostgreSQL, MySQL, Redis, Cosmos DB (superset
of DocumentDB) or Azure SQL (Microsoft SQL Server).

### Cosmos DB

Cosmos DB is globally distributed document-store NoSQL managed database
service. Cosmos DB automatically replicates all data to any number of
regions for faster data access by apps with a guaranteed availability of
99.99%, low latency of less than 10-ms on reads and less than 15ms
writes at the 99th percentile. It supports multiple interfaces such as
DocumentDB SQL which means developers can use familiar SQL query
capabilities while reaping the low latency benefits of a schema-less
data. Other API interfaces and models supported by Cosmos DB are Table
API, MongoDB and Graph.

[Learn More](https://docs.microsoft.com/en-us/azure/cosmos-db/introduction)  
[Get Started](https://docs.microsoft.com/en-us/azure/cosmos-db/documentdb-introduction)

### Azure SQL

With Azure SQL database (powered by Microsoft SQL Server engine),
developers get the full power, capability and performance of a SQL
database with the added elasticity and hands-off maintenance of a cloud.
Azure also offers a database-migration service, which moves data from
traditional relational on-premises SQL Server and Oracle databases to
the Azure SQL database.

[Learn More](https://docs.microsoft.com/en-us/azure/sql-database)  
[Get Started](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-get-started-portal)

### Azure Storage

Azure Storage consists of four services:

1.  Blob or Object Storage: Stores unstructured object data which could be text, or binary, e.g., files, movies, archives.

2.  Table Storage: Offers NoSQL key-value database with fast access to unstructured data.

3.  Queue Storage: Provides a reliable queue messaging for asynchronous and event-driven communications between cloud services

4.  File Storage: Offers a cloud-based [Server Message Block (SMB)](https://msdn.microsoft.com/en-us/library/windows/desktop/aa365233.aspx)
    file shares

All Azure Storage services are accessible by the REST HTTP API. Azure
Storage has SDKs for the most popular languages. By using the SDK, you
do not require REST HTTP calls, developers can simply invoke methods on
objects in the programming environment of their choice such as Java,
Node​.js, PHP, Ruby, Python, C++, iOS or Android.

[Learn More](https://docs.microsoft.com/en-us/azure/storage/storage-introduction)  
[Get Started](https://docs.microsoft.com/en-us/azure/storage/storage-create-storage-account)

## Web Content Delivery

Content Delivery Network allows faster high-bandwidth content delivery
to users, and saves costs by caching the static resources instead of
serving it from apps and databases. CDNs help cope with traffic surges,
for streaming video and improving user experience in general. Azure CDN
offers global content delivery with high availability, robust security
and rich developer APIs and tools, e.g., REST API, .NET, Node.js, or
PowerShell.

Azure CDN allows you to pick between three products: Azure CDN Standard
from Akamai, Azure CDN Standard from Verizon, and Azure CDN Premium from
Verizon with the latter being the richest in features. All products
offer integration with other Azure services such as Storage, Cloud
Services, App Service, and Media Services.

[Learn More](https://docs.microsoft.com/en-us/azure/cdn/cdn-overview)  
[Get Started](https://docs.microsoft.com/en-us/azure/cdn/cdn-create-new-endpoint)

## Building Resilient Web Apps

Azure Load Balancer can help with resilience and deliver high
availability, elasticity and improved network performance to web
applications. Azure Load Balancer offers 5 tuple hash based
distribution, health monitoring service, automatic reconfigurations
among other features.

In addition to load balancer which is a layer 4 (Transport level)
technology, Azure offers two additional ways to distribute network
traffic:
-   Application Gateway (layer 7, Application layer)  
-   Traffic Manager (DNS level)  

Developers can use them in isolation or in combination.

[Learn More](https://docs.microsoft.com/en-us/azure/load-balancer/load-balancer-overview)  
[Get Started](https://docs.microsoft.com/en-us/azure/load-balancer/load-balancer-internet-overview)
![](media/image2.png)