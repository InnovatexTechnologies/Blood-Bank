using BloodBank.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http.Results;

namespace BloodBank.Controllers
{
    public class EmployeeController : Controller
    {
        Employee employee = new Employee();
        public IActionResult Index()
        {
            string result = JsonConvert.SerializeObject(employee);
            string path = @"D:\json\employee.json";
            using (var tw = new StreamWriter(path, true))
            {
                tw.WriteLine(result);
                tw.Close();
            }
            return View();
        }
    }
}
