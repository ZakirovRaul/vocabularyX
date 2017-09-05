using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using VocabuleryX.DAL.Interfaces;

namespace VocabuleryX.DAL.Entities
{
    public class Word : IDataEntity
    {
        [Key]
        public int Id { get; set; }
        public string Origin { get; set; }
        public string Version { get; set; }
        public int Status { get; set; }
        public DateTime? ProcessDate { get; set; }

    }
}
