using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BloodBank.Models
{
    public class Discard
    {
        public int Id { get; set; }
        public string Reason { get; set; }
        public int DisplayIndex { get; set; }
    }
}
