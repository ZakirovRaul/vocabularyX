using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VocabuleryX.DAL.Entities;

namespace VocabuleryX.Models
{
    public class LearWordModel
    {
        public WordModel Word { get; set; }
        public string[] OriginOptions{ get; set; }
        public string[] VersionOptions { get; set; }
    }
}