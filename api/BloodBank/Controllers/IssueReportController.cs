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
    public class IssueReportController : ControllerBase
    {
        private IConfiguration Configuration;
        private readonly ILogger<IssueReportController> logger;

        public IssueReportController(ILogger<IssueReportController> _logger, IConfiguration _Configuration)
        {
            logger = _logger;
            Configuration = _Configuration;
        }

        [HttpGet]
        public ActionResult<List<StockReport>> Get(int FromDate, int ToDate)
        {
            try
            {
                string ConnString = this.Configuration.GetConnectionString("MyConn");

                using (SQLiteConnection db = new SQLiteConnection(ConnString))
                {
                    string Auth = Request.Headers["Auth"].FirstOrDefault() ?? "";

                    if (Auth.Length > 0)
                    {
                        byte[] base64EncodedBytes = System.Convert.FromBase64String(Auth);
                        string Authorization = System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
                        string user = Authorization.Split(':')[0];
                        string pass = Authorization.Split(':')[1];
                        int IsAuthOk = db.ExecuteScalar<int>("Select count(*) from Users where name ='" + user + "' and Password = '" + pass + "'");
                        if (IsAuthOk == 0)
                        {
                            return NotFound("Invalid User");
                        }
                        else
                        {
                            if (FromDate != null && FromDate != 0 && ToDate != null && ToDate != 0)
                            {

                                List<StockReport> stockReports = db.Query<StockReport>("select BloodGroup.Name BloodGroupName,BloodComponents.Name BloodComponentName,sum(qty)*-1 as TotalQty from stock " +
                                "left join BloodGroup on stock.BloodGroupId = BloodGroup.Id left join BloodComponents on stock.BloodComponentId = BloodComponents.Id " +
                                "where  stock.TransType='Issue' and Stock.Date>=" + FromDate + " and Stock.Date<=" + ToDate +
                                " group by BloodGroup.Name, BloodComponents.Name").ToList();
                                return Ok(stockReports);
                            }
                            else
                            {
                                List<StockReport> stockReports = db.Query<StockReport>("select BloodGroup.Name BloodGroupName,BloodComponents.Name BloodComponentName,sum(qty)*-1 as TotalQty from stock " +
                               "left join BloodGroup on stock.BloodGroupId = BloodGroup.Id left join BloodComponents on stock.BloodComponentId = BloodComponents.Id " +
                               "where  stock.TransType='Issue'" +
                               "group by BloodGroup.Name, BloodComponents.Name").ToList();
                                return Ok(stockReports);
                            }
                        }
                    }
                    else
                    {
                        return Unauthorized();
                    }
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
