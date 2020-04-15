powershell_script 'Configure LCM for dsc_resource' do
  code <<-EOH
    [DscLocalConfigurationManager()]
    Configuration ConfigLCM
    {
        Node "localhost"
        {
            Settings
            {
                ConfigurationMode = "ApplyOnly"
                RebootNodeIfNeeded = $false
                RefreshMode = 'Disabled'
            }
        }
    }

    ConfigLCM -OutputPath "#{Chef::Config[:file_cache_path]}\\DSC_LCM"

    Set-DscLocalConfigurationManager -Path "#{Chef::Config[:file_cache_path]}\\DSC_LCM"
  EOH
  only_if '(Get-DscLocalConfigurationManager).RefreshMode -notlike "Disabled"'
end
