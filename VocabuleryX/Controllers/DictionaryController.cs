using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Web;
using System.Web.Http.Results;
using System.Web.Mvc;
using VocabuleryX.DAL.Entities;
using VocabuleryX.DAL.Repositories;

namespace VocabuleryX.Controllers
{
    public class DictionaryController : Controller
    {
        private readonly EFUnitOfWork db;

        public DictionaryController()
        {
            db = new EFUnitOfWork();
        }

        public ActionResult Index()
        {
            var words = db.Words.GetAll().OrderByDescending(x=>x.Id);
            return View(words);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,Name,Translation")] Word word)
        {
            if (!ModelState.IsValid)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            var oldWord = db.Words.Get(word.Id);
            if (oldWord == null)
            {
                return new HttpNotFoundResult();
            }

            oldWord.Name = word.Name;
            oldWord.Translation = word.Translation;
            db.Words.Update(oldWord);

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        [HttpPost]
        public ActionResult Create([Bind(Exclude = "Status, ProcessDate")] Word word)
        {
            if (!ModelState.IsValid)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            db.Words.Create(word);
            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        [HttpPost]
        public ActionResult Delete(int id)
        {
            if (db.Words.Delete(id))
            {
                return new HttpStatusCodeResult(HttpStatusCode.OK);
            }
            else
            {
                return new HttpStatusCodeResult(HttpStatusCode.NotModified);
            }
        }

        //public ActionResult CreateWord(string origin, string version)
        //{
        //    //Thread.Sleep(2000);
        //    var existOne = unitOfWork.Words.Find(x => x.Origin == origin).FirstOrDefault();
        //    if ( existOne != null)
        //    {
        //        Response.StatusCode = 400;
        //        return Content("duplicate");
        //    }
        //    var word = new Word() {Origin = origin, Version = version};
        //    unitOfWork.Words.Create(word);
        //    return Json(word);
        //}

        //public ActionResult DeleteWord(int id)
        //{
        //    if (unitOfWork.Words.Delete(id))
        //    {
        //        return new HttpStatusCodeResult(HttpStatusCode.OK);
        //    }
        //    return new HttpStatusCodeResult(HttpStatusCode.NotFound);
        //}

        //public ActionResult UpdateWord(Word word)
        //{
        //    var item = unitOfWork.Words.Find(x=>x.Id == word.Id).First();
        //    if (item != null)
        //    {
        //        item.Origin = word.Origin;
        //        item.Version = word.Version;
        //        unitOfWork.Words.Update(item);
        //        return new HttpStatusCodeResult(HttpStatusCode.OK);
        //    }
        //    return new HttpStatusCodeResult(HttpStatusCode.NotFound);
        //}

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}