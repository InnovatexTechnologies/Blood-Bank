using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BloodBank.Models
{
    public class BagTypeConsumption
    {
        public int Id { get; set; }
        public int BagTypeId { get; set; }
        public int StockItemId { get; set; }
        public int Qty { get; set; }
        [NotMapped]
        public string StockItemName { get; set; }
    }
}
