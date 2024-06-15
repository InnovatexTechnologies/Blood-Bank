using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BloodBank.Models
{
    public class DiscardBlood
    {
        public int Id { get; set; }
        public string Reason { get; set; }
        public int BloodGroupId { get; set; }
        public int BloodComponentId { get; set; }
        public int BagTypeId { get; set; }
        public int Qty { get; set; }
        public int Donorno { get; set; }
        public int Date { get; set; }
        public string DiscardType { get; set; }
        public string BasedOn { get; set; }

        [NotMapped]
        public string BloodGroupName { get; set; }
        public string BloodComponentName { get; set; }
        public string BagTypeName { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Mobile { get; set; }
        public int DOD { get; set; }
        public string Gender { get; set; }
        public string DonationType { get; set; }
    }
}