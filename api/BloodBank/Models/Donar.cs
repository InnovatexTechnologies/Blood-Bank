using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BloodBank.Models
{
    public class Donar
    {
        public int Id { get; set; }
        public int RegistrationNo { get; set; }
        public int DOD { get; set; }
        public int UseStatus { get; set; }
        public int BloodGroupId { get; set; }
        public int BagTypeId { get; set; }
        public string Name { get; set; }
        public string Mobile { get; set; }
        public string Address { get; set; }
        public int DonationTypeId { get; set; }
        public int OrganizationId { get; set; }
        public int CampTypeId { get; set; }
        public int DonorTypeId { get; set; }
        public string DonorNo { get; set; }
        public string Gender { get; set; }
        public int Age { get; set; }
        [NotMapped]
        public string BloodGroupName { get; set; }
        public string BagTypeName { get; set; }
        public string DonationTypeName { get; set; }
        public string OrganizationName { get; set; }
        public string CampTypeName { get; set; }
        public string DonorTypeName { get; set; }
        public string Donations { get; set; }
        public string Plasma { get; set; }
        public string RBC { get; set; }
        public string Platelets { get; set; }
        public string WholeBlood { get; set; }
        public string DiscardReactive { get; set; }
        public string BasedOn { get; set; }
        public string Component { get; set; }
    }
}