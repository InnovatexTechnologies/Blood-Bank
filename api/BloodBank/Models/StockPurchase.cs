using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BloodBank.Models
{
    public class StockPurchase
    {
        public int Id { get; set; }
        public int Date { get; set; }
        public int StockItemId { get; set; }
        public int Qty { get; set; }
        public string Remark { get; set; }
        [NotMapped]
        public string StockItemName { get; set; }
    }
}
