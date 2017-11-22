using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Script.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using VocabuleryX.DAL.Classes;
using VocabuleryX.DAL.Entities;
using VocabuleryX.DAL.Repositories;
using VocabuleryX.Models;
using WebGrease.Css.Extensions;

namespace VocabuleryX.Controllers
{
    public class LearnController : Controller
    {
        private EFUnitOfWork db;

        public LearnController()
        {
            db = new EFUnitOfWork();
        }


        public ActionResult Index(string type)
        {
            Word[] words;
            switch (type)
            {
                case "new":
                    words = db.Words.Find(x => x.ProcessDate == null).Take(5).ToArray();
                    break;
                case "old":
                    words = db.Words.All.OrderBy(x => x.ProcessDate).Take(5).ToArray();
                    break;
                case "error":
                    words = db.Words.All.OrderBy(x => x.Status).Take(5).ToArray();
                    break;
                case "repeat":
                    words = Session["words"] as Word[];
                    break;
                default:
                    return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Session["words"] = words;
            //todo
            //if no words redirect to another page
            List<LearnViewModel> viewModels = new List<LearnViewModel>();
            foreach (var word in words)
            {
                LearnViewModel model = new LearnViewModel();
                model.Word = word;
                model.NativeOptions = db.Words.All.Where(x => x.Id != word.Id).Take(4).Select(x => x.Name)
                    .ToArray();
                model.ForeignOptions = db.Words.All.Where(x => x.Id != word.Id).Take(4).Select(x => x.Translation)
                    .ToArray();
                viewModels.Add(model);
            }

            return View(viewModels.ToArray());
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult Complete(string mistakes)
        {
            var items = System.Web.Helpers.Json.Decode<Mistake[]>(mistakes);
            foreach (var item in items)
            {
                var word = db.Words.Get(item.Id);
                if (word != null)
                {
                    word.Status = item.Count;
                    word.ProcessDate = DateTime.Now;
                    db.Words.Update(word);
                }
            }
            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        //public ActionResult Repeat(int[] id)
        //{
        //    if (id == null)
        //    {
        //        return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        //    }

        //    List<Word> words = new List<Word>();
        //    id.ForEach(x =>
        //    {
        //        var item = db.Words.Get(x);
        //        if (item != null)
        //        {
        //            words.Add(item);
        //        }
                
        //    });
        //    List<LearnViewModel> viewModels = new List<LearnViewModel>();
        //    foreach (var word in words)
        //    {
        //        LearnViewModel model = new LearnViewModel();
        //        model.Word = word;
        //        model.NativeOptions = db.Words.All.Where(x => x.Id != word.Id).Take(4).Select(x => x.Name)
        //            .ToArray();
        //        model.ForeignOptions = db.Words.All.Where(x => x.Id != word.Id).Take(4).Select(x => x.Translation)
        //            .ToArray();
        //        viewModels.Add(model);
        //    }
        //    return View("Index", viewModels);
        //}

        //public ActionResult Index(string type)
        //{
        //    IEnumerable<Word> words = null;
        //    if (type == "new")
        //    {
        //        words = ef.Words.Find(x => x.ProcessDate == null).Take(5).ToList();
        //    }
        //    else if (type == "old")
        //    {
        //        words = ef.Words.Find(x => x.ProcessDate != null).OrderBy(x=>x.ProcessDate).Take(5).ToList();
        //    }
        //    else
        //    {
        //        return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        //    }

        //    List<LearWordModel> models = new List<LearWordModel>();
        //    foreach (var word in words)
        //    {
        //        models.Add(new LearWordModel()
        //        {
        //            Word = new WordModel() {Id = word.Id, Origin = word.Origin, Version = word.Version},
        //            OriginOptions = ef.Words.Find(x=>x.Origin != word.Origin).Take(4).Select(x=>x.Origin).ToArray(),
        //            VersionOptions = ef.Words.Find(x=>x.Version != word.Version).Take(4).Select(x=>x.Version).ToArray()
        //        });
        //    }
        //    return View(models);
        //}

        //public ActionResult Complete(string huy1)
        //{
        //    LearViewModel[] result = new JavaScriptSerializer().Deserialize<LearViewModel[]>(huy1);
        //    foreach (var item in result)
        //    {
        //        Word word = ef.Words.Find(x => x.Id == item.Id).FirstOrDefault();
        //        word.Status = item.Count;
        //        word.ProcessDate = DateTime.Now;
        //        ef.Words.Update(word);
        //    }



        //    return RedirectToAction("Training", "Home");
        //}


        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}