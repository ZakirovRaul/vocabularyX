using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using VocabuleryX.DAL.Entities;
using VocabuleryX.DAL.Repositories;

namespace VocabuleryX.Controllers
{
    public class DictionaryController : Controller
    {
        private readonly EFUnitOfWork unitOfWork;

        public DictionaryController()
        {
            unitOfWork = new EFUnitOfWork();
        }

        public ActionResult Index()
        {
            var words = unitOfWork.Words.GetAll().OrderByDescending(x=>x.Id);
            return View(words);
        }

        public ActionResult CreateWord(string origin, string version)
        {
            //Thread.Sleep(2000);
            var existOne = unitOfWork.Words.Find(x => x.Origin == origin).FirstOrDefault();
            if ( existOne != null)
            {
                Response.StatusCode = 400;
                return Content("duplicate");
            }
            var word = new Word() {Origin = origin, Version = version};
            unitOfWork.Words.Create(word);
            return Json(word);
        }

        public ActionResult DeleteWord(int id)
        {
            if (unitOfWork.Words.Delete(id))
            {
                return new HttpStatusCodeResult(HttpStatusCode.OK);
            }
            return new HttpStatusCodeResult(HttpStatusCode.NotFound);
        }

        public ActionResult UpdateWord(Word word)
        {
            var item = unitOfWork.Words.Find(x=>x.Id == word.Id).First();
            if (item != null)
            {
                item.Origin = word.Origin;
                item.Version = word.Version;
                unitOfWork.Words.Update(item);
                return new HttpStatusCodeResult(HttpStatusCode.OK);
            }
            return new HttpStatusCodeResult(HttpStatusCode.NotFound);
        }
    }
}