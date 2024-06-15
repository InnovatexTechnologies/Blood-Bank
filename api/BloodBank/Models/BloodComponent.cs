using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BloodBank.Models
{
    public class BloodComponent
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public int DisplayIndex { get; set; }
        public int ExpireDays { get; set; }
    }
}