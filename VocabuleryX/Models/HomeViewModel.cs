using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VocabuleryX.DAL.Entities;

namespace VocabuleryX.Models
{
    public class HomeViewModel
    {
        public int TotalWords { get; set; }
        public Word[] NextWords { get; set; }
        public Word[] OldWords { get; set; }
        public Word[] ErrorWords { get; set; }
    }
}