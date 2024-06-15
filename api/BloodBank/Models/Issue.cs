using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BloodBank.Models
{
    public class Issue
    {
        public int Id { get; set; }
        public int DOI { get; set; }
        public string PatientName { get; set; }
        public int HospitalId { get; set; }
        public int Amount { get; set; }
        public int SupplyNo { get; set; }
        public int BloodComponentId { get; set; }
        public string Institution_Doctor { get; set; }
        public int PatientTypeId { get; set; }
        public string DonorNo { get; set; }
        public int BloodGroupId { get; set; }
        public int ReceiptNo { get; set; }
        public string AgainstDonor { get; set; }
        public string Free_Paid { get; set; }
        public string Remark { get; set; }
        [NotMapped]
        public string Type { get; set; }
        public string BloodGroupName { get; set; }
        public string BloodComponentsName { get; set; }
        public string PatientTypeName { get; set; }
    }
}
