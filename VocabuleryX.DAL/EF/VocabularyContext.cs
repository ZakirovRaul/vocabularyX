using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using VocabuleryX.DAL.Entities;

namespace VocabuleryX.DAL.EF
{
    public class VocabularyContext : DbContext
    {
        static VocabularyContext()
        {
            System.Data.Entity.Database.SetInitializer(new VocabularyDBInitializer());
        }

        public VocabularyContext() : base("DefaultConnection")
        {
        }


        public DbSet<Word> Words { get; set; }
    }

    public class VocabularyDBInitializer : CreateDatabaseIfNotExists<VocabularyContext>
    {
        protected override void Seed(VocabularyContext context)
        {
            //context.Words.Add(new Word() { Origin = "gander", Version = "гусак" });
            //context.Words.Add(new Word() { Origin = "waddle", Version = "ходить в перевалку" });
            //context.Words.Add(new Word() { Origin = "silly", Version = "глупый" });
            //context.Words.Add(new Word() { Origin = "nearsighted", Version = "близорукий" });
            //context.Words.Add(new Word() { Origin = "dreadfully", Version = "ужасно" });
            base.Seed(context);
        }
    }
}
