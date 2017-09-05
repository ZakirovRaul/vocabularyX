using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VocabuleryX.DAL.Entities;

namespace VocabuleryX.DAL.Interfaces
{
    interface IUnitOfWork : IDisposable
    {
        IRepository<Word> Words { get; }
    }
}
