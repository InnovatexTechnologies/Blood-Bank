using BloodBank.Models;
using Dapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.Linq;
using System.Threading.Tasks;

namespace BloodBank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")]
    public class StockReportController : ControllerBase
    {
        private IConfiguration Configuration;
        private readonly ILogger<StockReportController> logger;

        public StockReportController(ILogger<StockReportController> _logger, IConfiguration _Configuration)
        {
            logger = _logger;
            Configuration = _Configuration;
        }

        [HttpGet]
        public ActionResult<List<StockReport>> Get(int Date)
        {
            try
            {
                string ConnString = this.Configuration.GetConnectionString("MyConn");

                using (SQLiteConnection db = new SQLiteConnection(ConnString))
                {
                    //string Auth = Request.Headers["Auth"].FirstOrDefault() ?? "";

                    //if (Auth.Length > 0)
                    //{
                    //    byte[] base64EncodedBytes = System.Convert.FromBase64String(Auth);
                    //    string Authorization = System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
                    //    string user = Authorization.Split(':')[0];
                    //    string pass = Authorization.Split(':')[1];
                    //    int IsAuthOk = db.ExecuteScalar<int>("Select count(*) from Users where name ='" + user + "' and Password = '" + pass + "'");
                    //    if (IsAuthOk == 0)
                    //    {
                    //        return NotFound("Invalid User");
                    //    }
                    //    else
                    //    {
                    if (Date != null && Date != 0)
                    {

                        List<StockReport> stockReports = db.Query<StockReport>("select BloodGroup.Name BloodGroupName,BloodComponents.Name BloodComponentName,sum(qty) as TotalQty from stock " +
                        "left join BloodGroup on stock.BloodGroupId = BloodGroup.Id left join BloodComponents on stock.BloodComponentId = BloodComponents.Id where Stock.Date <=" + Date + " group by BloodGroup.Name, BloodComponents.Name ").ToList();
                        return Ok(stockReports);
                    }
                    else
                    {

                        List<StockReport> stockReports = db.Query<StockReport>("select BloodGroup.Name BloodGroupName,BloodComponents.Name BloodComponentName,sum(qty) as TotalQty from stock " +
                        "left join BloodGroup on stock.BloodGroupId = BloodGroup.Id left join BloodComponents on stock.BloodComponentId = BloodComponents.Id group by BloodGroup.Name, BloodComponents.Name ").ToList();
                        return Ok(stockReports);
                    }
                    //    }
                    //}
                    //else
                    //{
                    //    return Unauthorized();
                    //}
                }
            }
            catch (Exception ex)
            {
                if (ex.InnerException == null)
                {
                    return BadRequest(new
                    {
                        Message = ex.Message
                    });
                }
                else
                {
                    return BadRequest(new { Message = ex.InnerException.Message });
                }
            }
        }

    }
}