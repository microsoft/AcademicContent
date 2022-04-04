include_recipe "iis-dsc::configure_lcm"

site_name = "MyWebSite"

dsc_resource 'Install IIS' do
  resource :windowsfeature
  property :name,  'web-server'
end

dsc_resource 'Shutdown Default Website' do
  resource :xwebsite
  property :name, 'Default Web Site'
  property :State, 'Stopped'
  property :PhysicalPath, 'C:\inetpub\wwwroot'
end

site_dir = "#{ENV['SYSTEMDRIVE']}\\inetpub\\wwwroot\\#{site_name}"

dsc_resource "#{site_name} Directory" do
  resource :file
  module_name 'PSDesiredStateConfiguration'
  property :DestinationPath, site_dir
  property :Type, 'Directory'
end

dsc_resource "#{site_name} App Pool" do
  resource :xWebAppPool
  property :Name, site_name
end

dsc_resource "#{site_name} Web Site" do
  resource :xWebSite
  property :Name, site_name
  property :ApplicationPool, site_name
  property :PhysicalPath, site_dir
end

file "#{site_dir}\\Default.htm"  do
  content  "<html><body><h1>Hello World!</h1><h2>Welcome to #{site_name}</h2></body></html>"
  rights :read, 'Everyone'
  action  :create
  notifies :restart, 'service[w3svc]'
end

service 'w3svc' do
  action [:enable, :start]
end
