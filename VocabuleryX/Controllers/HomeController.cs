using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VocabuleryX.DAL.Repositories;
using VocabuleryX.Models;

namespace VocabuleryX.Controllers
{
    public class HomeController : Controller
    {
        private EFUnitOfWork ef;

        public HomeController()
        {
            ef = new EFUnitOfWork();
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Training()
        {
            var viewModel = new TrainingViewModel();
            viewModel.NewWords = ef.Words.Find(x => x.ProcessDate == null).Take(5).ToArray();
            viewModel.OldWords = ef.Words.Find(x => x.ProcessDate != null).OrderBy(x => x.ProcessDate).Take(5).ToArray();
            return View(viewModel);
        }

        public ActionResult Import()
        {
            return View();
        }

        public ActionResult Test()
        {
            return Content("123");
        }
    }
}