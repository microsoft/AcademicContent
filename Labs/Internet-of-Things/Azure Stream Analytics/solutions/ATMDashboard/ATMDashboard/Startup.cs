using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ATMDashboard.Startup))]
namespace ATMDashboard
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
