using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using VocabuleryX.DAL.Entities;
using VocabuleryX.DAL.Repositories;
using VocabuleryX.Models;

namespace VocabuleryX.Controllers
{
    public class LearnController : Controller
    {
        private EFUnitOfWork ef;

        public LearnController()
        {
            ef = new EFUnitOfWork();
        }

        public ActionResult Index(string type)
        {
            IEnumerable<Word> words = null;
            if (type == "new")
            {
                words = ef.Words.Find(x => x.ProcessDate == null).Take(5).ToList();
            }
            else if (type == "old")
            {
                words = ef.Words.Find(x => x.ProcessDate != null).OrderBy(x=>x.ProcessDate).Take(5).ToList();
            }
            else
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            List<LearWordModel> models = new List<LearWordModel>();
            foreach (var word in words)
            {
                models.Add(new LearWordModel()
                {
                    Word = new WordModel() {Id = word.Id, Origin = word.Origin, Version = word.Version},
                    OriginOptions = ef.Words.Find(x=>x.Origin != word.Origin).Take(4).Select(x=>x.Origin).ToArray(),
                    VersionOptions = ef.Words.Find(x=>x.Version != word.Version).Take(4).Select(x=>x.Version).ToArray()
                });
            }
            return View(models);
        }

        public ActionResult Complete(string lessonResult)
        {
            LearViewModel[] result = new JavaScriptSerializer().Deserialize<LearViewModel[]>(lessonResult);
            foreach (var item in result)
            {
                Word word = ef.Words.Find(x => x.Id == item.Id).FirstOrDefault();
                word.Status = item.Count;
                word.ProcessDate = DateTime.Now;
                ef.Words.Update(word);
            }

          
            
            return RedirectToAction("Training", "Home");
        }
    }
}