using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VocabuleryX.DAL.EF;
using VocabuleryX.DAL.Entities;
using VocabuleryX.DAL.Interfaces;

namespace VocabuleryX.DAL.Repositories
{
    public class EFUnitOfWork : IUnitOfWork
    {
        private VocabularyContext dbContext;
        private WordRepository wordRepository;

        public EFUnitOfWork()
        {
            dbContext = new VocabularyContext();
        }

        public IRepository<Word> Words {
            get
            {
                if (wordRepository == null)
                {
                    wordRepository = new WordRepository(dbContext);
                }
                return wordRepository;
            }
        }

        public void Dispose()
        {
            dbContext?.Dispose();
        }
    }
}
