using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BloodBank.Models;

namespace BloodBank.Models
{
    public class BagType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int DisplayIndex { get; set; }
        public int Qty { get; set; }
        public string Components { get; set; }
        public List<BagTypeConsumption> bagTypeConsumptions { get; set; } = new List<BagTypeConsumption>();
    }
}
