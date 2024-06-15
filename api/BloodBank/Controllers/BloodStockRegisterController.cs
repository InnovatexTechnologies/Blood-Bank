using BloodBank.Models;
using Dapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
namespace BloodBank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")]
    public class BloodStockRegisterController : Controller
    {
        private IConfiguration Configuration;
        private readonly ILogger<BloodStockRegisterController> logger;

        public BloodStockRegisterController(ILogger<BloodStockRegisterController> _logger, IConfiguration _Configuration)
        {
            logger = _logger;
            Configuration = _Configuration;
        }
        [HttpGet]
        public ActionResult<List<Stock>> Get(int FromDate, int ToDate, int BloodGroup, int BloodComponent)
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
                            List<Stock> obj = db.Query<Stock>("select BloodGroup.Name BloodGroupName," +
                                " BloodComponents.Name BloodComponentsName,Stock.Date," +
                                " Stock.TransType,Stock.Qty from Stock" +
                                " left JOIN BloodGroup on BloodGroup.Id== Stock.BloodGroupId" +
                                " left JOIN BloodComponents on BloodComponents.Id== Stock.BloodComponentId" +
                                " where BloodGroup.Id==" + BloodGroup + " and BloodComponents.Id==" + BloodComponent + "" +
                                " and Stock.Date>=" + FromDate + " and  Stock.Date<=" + ToDate + " order by Stock.Date").ToList();
                            return Ok(obj);
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
                    return BadRequest(new { Message = ex.Message });
                }
                else
                {
                    return BadRequest(new { Message = ex.InnerException.Message });
                }
            }
        }
    }
}