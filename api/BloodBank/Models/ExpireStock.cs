using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BloodBank.Models
{
    public class ExpireStock
    {
        public int Id { get; set; }
        public int dod { get; set; }
        public int donorno { get; set; }
        public string name { get; set; }
        public int Qty { get; set; }

        public int exp
        {
            get
            {
                return int.Parse(dod.ToDate().AddDays(7).ToString("yyyyMMdd"));
            }
        }

        [NotMapped]
        public string BloodGroupName { get; set; }
    }
}