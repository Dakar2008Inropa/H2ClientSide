﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ClientSideStudentAPI.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Teams()
        {
            return View();
        }

        public ActionResult Courses()
        {
            return View();
        }

        #region PartialViews
        public PartialViewResult _NavBar()
        {
            return PartialView();
        }
        #endregion
    }
}