using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BloodBank.Models
{
    public class OpeningStock
    {
        public int Id { get; set; }
        public int BloodGroupId { get; set; }
        public int BloodComponentId { get; set; }
        public int Qty { get; set; }
        public string DonorNo { get; set; }
        public int Date { get; set; }
        [NotMapped]
        public string BloodGroupName { get; set; }
        public string BloodComponentName { get; set; }
    }
}
