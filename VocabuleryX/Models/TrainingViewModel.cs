using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VocabuleryX.DAL.Entities;

namespace VocabuleryX.Models
{
    public class TrainingViewModel
    {
        public Word[] NewWords { get; set; }
        public Word[] OldWords { get; set; }
    }
}