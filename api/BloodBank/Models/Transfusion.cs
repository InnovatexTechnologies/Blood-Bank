using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BloodBank.Models
{
    public class Transfusion
    {
        public int Id { get; set; }
        public string SupplyNo { get; set; }
        public string HospitalName { get; set; }
        public int HospitalType { get; set; }
        public int PatientType { get; set; }
        public int PreviousDonorNo { get; set; }
        public int PreviousComponentId { get; set; }
        public int NewDonorNo { get; set; }
        public int NewComponentId { get; set; }
        public int BloodGroupId { get; set; }
        public int Date { get; set; }
        public string Reason { get; set; }
        [NotMapped]
        public string NewComponentName { get; set; }
        public string PreviousComponentName { get; set; }
        public string BloodGroupName { get; set; }
    }
}
