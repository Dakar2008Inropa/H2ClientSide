using System.Web;
using System.Web.Optimization;

namespace ClientSideConverter
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/BootstrapCSS").Include(
                      "~/Content/bootstrap.css"));

            bundles.Add(new StyleBundle("~/Content/Main/MainCSS").Include(
                "~/Content/Main/MainCSS.min.css"));
        }
    }
}
