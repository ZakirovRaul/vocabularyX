using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VocabuleryX.DAL.Entities;

namespace VocabuleryX.Models
{
    public class LearnViewModel
    {
        public Word Word { get; set; }
        public string[] NativeOptions { get; set; }
        public string[] ForeignOptions { get; set; }
    }
}