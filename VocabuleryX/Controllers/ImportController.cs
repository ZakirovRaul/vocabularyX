using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using VocabuleryX.DAL.Entities;
using VocabuleryX.DAL.Repositories;
using VocabuleryX.Models;

namespace VocabuleryX.Controllers
{
    public class ImportController : Controller
    {
        private EFUnitOfWork db;

        public ImportController()
        {
            db = new EFUnitOfWork();
        }

        // GET: Import
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Save(WordImportViewModel[] words)
        {
            List<WordImportFailViewModel> failWords = new List<WordImportFailViewModel>();
            foreach (var word in words)
            {
                string error;
                if (Validate(word, out error))
                {
                    db.Words.Create(new Word() {Name = word.Name, Translation = word.Translation});
                }
                else
                {
                    failWords.Add(new WordImportFailViewModel() { Name = word.Name, Translation = word.Translation, Error = error });
                }
            }
            return Json(failWords);
        }

        private bool Validate(WordImportViewModel word, out string error)
        {
            if (string.IsNullOrEmpty(word.Name))
            {
                error = "Text is empty";
                return false;
            }

            if (string.IsNullOrEmpty(word.Translation))
            {
                error = "Translation is empty";
                return false;
            }

            var existWord = db.Words.Find(x => x.Name == word.Name).FirstOrDefault();
            if (existWord != null)
            {
                error = "Duplicate word";
                return false;
            }

            error = string.Empty;
            return true;
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}