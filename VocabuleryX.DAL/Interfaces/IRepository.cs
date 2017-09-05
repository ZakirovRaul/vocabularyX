using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VocabuleryX.DAL.Interfaces
{
    public interface IRepository<T> where T : IDataEntity
    {
        IEnumerable<T> GetAll();
        T Get(int id);
        IEnumerable<T> Find(Func<T,bool> predicat);
        void Create(T item);
        void Update(T item);
        bool Delete(int id);
    }
}
