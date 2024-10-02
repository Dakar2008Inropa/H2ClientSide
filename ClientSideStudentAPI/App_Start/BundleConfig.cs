using System.Web;
using System.Web.Optimization;

namespace ClientSideStudentAPI
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Library/JS/JQuery/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Library/JS/JQueryValidate/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Library/JS/Modernizr/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Library/JS/Bootstrap/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Library/CSS/BootstrapCSS").Include(
                      "~/Library/CSS/Bootstrap/bootstrap.min.css"));

            bundles.Add(new StyleBundle("~/Content/Main/Maincss").Include(
                "~/Content/Main/MainCSS.min.css"));
        }
    }
}