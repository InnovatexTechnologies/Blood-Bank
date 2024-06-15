using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BloodBank.Models
{
    public class BulkTransfer
    {
        public int Id { get; set; }
        public int Date { get; set; }
        public string Name { get; set; }
        public int BloodGroupId { get; set; }
        public int BloodComponentId { get; set; }
        public int Qty { get; set; }
        public string Organisation_Company { get; set; }
        public string Remark { get; set; }
        [NotMapped]
        public string BloodGroupName { get; set; }
        public string BloodComponentName { get; set; }
    }
}
