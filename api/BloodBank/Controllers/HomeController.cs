using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BloodBank.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return Content("API is Live to Go...");
        }
    }
}
