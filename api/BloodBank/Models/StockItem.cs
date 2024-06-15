using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BloodBank.Models
{
    public class StockItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int OpeningStock { get; set; }
        public int Date { get; set; }

    }
}
