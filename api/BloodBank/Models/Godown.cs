using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BloodBank.Models
{
    public class Godown
    {
        public int Id { get; set; }
        public string TransType { get; set; }
        public int Date { get; set; }
        public int RefId { get; set; }
        public int StockItemId { get; set; }
        public int Qty { get; set; }

    }
}
