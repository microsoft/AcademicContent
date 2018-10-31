![](media/image1.png)
# Infrastructure as a Service 

For tech and IT professionals, cloud computing is mostly associated with
Infrastructure as a Service. In this guide, you will learn what Azure
offers when you need to create one or one thousand virtual machines in
the cloud, how to harness the portability of containers, and how Azure
allows you to create private virtual networks and connect them to
private/on-premises environments. In this guide we will cover:

-   [Virtual Machines](#virtual-machines)
-   [Working with VMs at Scale: Virtual Machine Scale Sets](#working-with-vms-at-scale-virtual-machine-scale-sets)
-   [Working with VMs at Scale: Azure Batch](#working-with-vms-at-scale-azure-batch)
-   [Reducing Errors with Automation: Azure Resource Manager](#reducing-errors-with-automation-azure-resource-manager)
-   [Virtual Networks](#virtual-networks)
-   [Increasing Portability: Azure Container Service](#increasing-portability-azure-container-service)
-   [Increasing Portability: Azure Container Registry](#increasing-portability-azure-container-registry)
-   [Increasing Portability: Azure Service Fabric](#increasing-portability-azure-service-fabric)

## Virtual Machines

Microsoft Azure provides Virtual Machines as a service with support for
Linux and Windows VMs. Azure Virtual Machines Service offers
integration, delivery, development and an extension of your data centers
(hybrid cloud). The Azure Marketplace provides a number of pre-built
environments and software, both free, community and open-source as well
as paid. Examples include Windows Server, Microsoft SQL Server, Red Hat,
and Ubuntu. Pay only for what you use with per-minute billing.

Azure VMs support rich developer tooling such as web interface via Azure
Portal, as well as command-line tools: Azure CLI and Azure PowerShell or
Bash. VMs can be managed by the RESTful HTTP API or in the programming
language of your choice, e.g., .NET, Java, Node.js or Python.

[Learn More](https://docs.microsoft.com/en-us/azure/virtual-machines/)  
[Get Started: Azure Windows Virtual Machines](https://docs.microsoft.com/en-us/azure/virtual-machines/windows)  
[Get Started: Azure Linux Virtual Machines](https://docs.microsoft.com/en-us/azure/virtual-machines/linux)  

## Working with VMs at Scale: Virtual Machine Scale Sets

One of the benefits of the cloud is the automation and the ability to
provision 1000s of VM. It is possible to rollout your own solution with
many of the developer tools which Azure provides such as Azure CLI or
REST API. However, there's a better way with Scale Sets. Azure Virtual
Machine Scale Sets allows developers to deploy and manage a set of
identical VMs (server farms). Scale Sets service allows you to upload
your own images (up to 100), and there might be up to 1000 VM in a set.

The Scale Sets service has the ability to auto-scale the VM up or down.
This is helpful when working with big-compute tasks, big data and
high-load systems.

[Learn More](https://docs.microsoft.com/en-us/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-overview)  
[Get Started](https://docs.microsoft.com/en-us/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-portal-create)

## Working with VMs at Scale: Azure Batch

Azure Batch is an Azure service which automates a large number of VMs
and can automatically scale up or down compute resources. Developers can
define compute resources such as VMs and execute applications on them in
parallel and at scale.

With Azure Batch, there is no need to manually provision and configure
the infrastructure or schedule tasks. Batch was designed for operations
which regularly process, transform or analyze large volumes of data.
Azure Batch works well with intrinsically parallel applications and
workloads—those which are straightforward to split and perform on
different machines.

[Learn More](https://docs.microsoft.com/en-us/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-portal-create)  
[Get Started](https://docs.microsoft.com/en-us/azure/batch/batch-account-create-portal)  

## Reducing Errors with Automation: Azure Resource Manager

Azure provides a rich tooling to facilitate infrastructure as code so
developers can reap the benefits such as reproducibility, elasticity,
versioning and testing. Developers can utilize one of the many SDKs, CLI
or PowerShell or REST APIs.

Azure Resource Manager allows you to deploy, monitor and manage Azure
resources as a group so you can work with all resources in a single
coordinated operation. With Azure Resource Manager, developers use
templates to describe all the resources needed including VMs, storage,
virtual networks, web apps, databases, etc. This allows to repeatedly
deploy in a consistent state without any discrepancies. If one resource
fails, the entire group will fallback. Azure Resource Manager natively
supports Role-Based Access Control to apply access control to all
resources in a group.

Resource Manager templates are written in JSON. This declarative
approach of templates offers better maintenance, more predictability and
improved readability over CLI or SDK scripts because there's no racing
conditions with the declarative approach of Resource Manager templates.

Developers don't have to create templates from scratch every time. There
is a template export feature which will generate a template and a wide
variety of ready-to-use templates.

[Learn More](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview)  
[Get Started](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-manager-create-first-template)

## Virtual Networks

Using Azure Virtual Network (VNet) service, developers can set up
logical representations of their networks in the cloud. VNet is a
logical isolation of the Azure cloud dedicated to your subscription. All
Azure resources in a VNet can securely connect to each other.

Azure Virtual Network offers:

-   Isolation: Networks are isolated from one another and can be
    segmented into subnets

-   Connectivity: VNets can be connected, resources can be connected to
    each other and/or the Internet and VNets can be connected to
    on-premises networks

-   Traffic filtering: Inbound and outbound traffic can be filtered by
    IP, destination, protocol and port

-   Routing: Developers can override default and configure routes

To connect a virtual network (VNet) with on-premises networks, other
Azure VNets, or Microsoft networks, Azure offers VPN Gateway which sends
*encrypted* traffic across via the public connection.

[Learn More](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-manager-create-first-template)  
[Get Started](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-create-vnet-arm-pportal)   

## Increasing Portability: Azure Container Service

Azure Container Service allows developers to manage, create and
configure clusters of VMs which are pre-configured by the Container
Service to run containerized applications. Azure Container Service
leverages the Docker container format to ensure the maximum portability
between environments and at the orchestration layers.

Azure Container Service allows developers to utilize Docker containers
by using open-source tools and technologies that are popular among
developers today including DC/OS, Docker Swarm and Kubernetes. This
allows developers to use familiar tools including DCOS CLI, Docker CLI
and kubectl.

[Learn More](https://docs.microsoft.com/en-us/azure/container-service/container-service-intro)  
[Get Started](https://docs.microsoft.com/en-us/azure/container-service/container-service-kubernetes-walkthrough)  

## Increasing Portability: Azure Container Registry

Azure Container Registry allows developers to store and manage their
private container images across all types of Azure deployments (e.g.,
App Service), not just across Container Service deployments. Azure
Container Registry is managed via portal, CLI or REST API interfaces,
and is based on the open-sourced Docker Registry 2.0.

[Learn More](https://docs.microsoft.com/en-us/azure/container-service/container-service-kubernetes-walkthrough)  
[Get Started](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-get-started-portal)

## Increasing Portability: Azure Service Fabric

Azure Service Fabric is the middleware platform for building and
managing enterprise-level, tier-one, cloud-scale applications by making
it easy to package, deploy and manage reliable and scalable
microservices.

Service Fabric powers many Microsoft services such as Azure SQL
Database, Azure Cosmos DB, Cortana, Microsoft Power BI, Microsoft
Intune, Azure Event Hubs, Azure IoT Hub, Skype for Business, and others.
Service Fabric can deploy any executables and runtimes and make them
reliable. There's no direct equivalents to Azure Service Fabric in AWS.

[Learn More](https://mva.microsoft.com/en-US/training-courses/building-microservices-applications-on-azure-service-fabric-16747)  
[Get Started](https://mva.microsoft.com/en-US/training-courses/building-microservices-applications-on-azure-service-fabric-16747)