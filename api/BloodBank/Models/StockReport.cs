using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BloodBank.Models
{
    public class StockReport
    {
        public string BloodGroupName { get; set; }
        public string BloodComponentName { get; set; }
        public int TotalQty { get; set; }
    }
}
