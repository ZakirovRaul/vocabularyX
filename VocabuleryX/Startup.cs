using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(VocabuleryX.Startup))]
namespace VocabuleryX
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
