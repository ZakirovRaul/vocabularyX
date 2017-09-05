using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VocabuleryX.DAL.EF;
using VocabuleryX.DAL.Entities;
using VocabuleryX.DAL.Interfaces;

namespace VocabuleryX.DAL.Repositories
{
    public class WordRepository : IRepository<Word>
    {
        private VocabularyContext db;
        public WordRepository(VocabularyContext db)
        {
            this.db = db;
        }

        public IEnumerable<Word> GetAll()
        {
            return db.Words.ToList();
        }

        public Word Get(int id)
        {
            return db.Words.Find(id);
        }

        public IEnumerable<Word> Find(Func<Word, bool> predicat)
        {
            return db.Words.Where(predicat).ToList();
        }

        public void Create(Word item)
        {
            db.Words.Add(item);
            db.SaveChanges();
        }

        public void Update(Word item)
        {
            db.Entry(item).State = EntityState.Modified;
            db.SaveChanges();
        }

        public bool Delete(int id)
        {
            var item = db.Words.Find(id);
            if (item != null)
            {
                db.Words.Remove(item);
                db.SaveChanges();
                return true;
            }
            return false;
        }
    }
}
