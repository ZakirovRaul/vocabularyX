using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VocabuleryX.Models
{
    public class WordImportViewModel
    {
        public string Name { get; set; }
        public string Translation { get; set; }
    }

    public class WordImportFailViewModel
    {
        public string Name { get; set; }
        public string Translation { get; set; }
        public string Error { get; set; }
    }
}