using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ClientSideCityAPI.Controllers
{
    public class HomeController : Controller
    {
        #region Views
        public ActionResult Index()
        {
            return View();
        }
        #endregion

        #region PartialViews
        public PartialViewResult _NavBar()
        {
            return PartialView();
        }
        #endregion
    }
}