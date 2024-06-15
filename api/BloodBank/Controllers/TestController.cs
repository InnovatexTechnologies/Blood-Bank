using BloodBank.Models;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;

namespace BloodBank.Controllers
{
    public class TestController : Controller
    {
        private IConfiguration Configuration;
        private readonly ILogger<TestController> logger;

        public TestController(ILogger<TestController> _logger, IConfiguration _Configuration)
        {
            logger = _logger;
            Configuration = _Configuration;
        }
        public IActionResult Index()
        {
            string ConnString = this.Configuration.GetConnectionString("MyConn");
            using (SQLiteConnection db = new SQLiteConnection(ConnString))
            {
                string Auth = Request.Headers["Auth"].FirstOrDefault() ?? "";
                List<Stock> stocks = db.Query<Stock>("select * from Stock").ToList();
                foreach (var stock in stocks)
                {
                    stock.DOE = int.Parse(stock.Date.ToDate().AddDays(5).ToString("yyyyMMdd"));
                    db.Execute("update Stock set DOE="+ stock.DOE + " where Id=" + stock.Id);

                }
            }
            return View();
        }
    }
}