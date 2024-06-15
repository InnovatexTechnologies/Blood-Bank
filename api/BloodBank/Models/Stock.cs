using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BloodBank.Models
{
    public class Stock
    {
        public int Id { get; set; }
        public string TransType { get; set; }
        public int Date { get; set; }
        public int RefId { get; set; }
        public int BloodGroupId { get; set; }
        public int BloodComponentId { get; set; }
        public int BagTypeId { get; set; }
        public int Qty { get; set; }
        public int DisplayIndex { get; set; }
        public string DonorNumber { get; set; }
        public int DOE { get; set; }

        [NotMapped]
        public string BloodGroupName { get; set; }
        public string BloodComponentsName { get; set; }
    }
}
