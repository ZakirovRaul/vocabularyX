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
        private EFUnitOfWork db;

        public HomeController()
        {
            db = new EFUnitOfWork();
        }

        public ActionResult Index()
        {
            HomeViewModel viewModel = new HomeViewModel();
            viewModel.TotalWords = db.Words.All.Count();
            viewModel.NextWords = db.Words.Find(x => x.ProcessDate == null).Take(5).ToArray();
            viewModel.OldWords = db.Words.All.OrderBy(x => x.ProcessDate).Take(5).ToArray();
            viewModel.ErrorWords = db.Words.All.OrderBy(x => x.Status).Take(5).ToArray();

            return View(viewModel);
        }

        public ActionResult Training()
        {
            var viewModel = new TrainingViewModel();
            viewModel.NewWords = db.Words.Find(x => x.ProcessDate == null).Take(5).ToArray();
            viewModel.OldWords = db.Words.Find(x => x.ProcessDate != null).OrderBy(x => x.ProcessDate).Take(5).ToArray();
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