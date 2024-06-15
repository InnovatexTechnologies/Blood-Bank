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
    public class GodownController : ControllerBase
    {
        private IConfiguration Configuration;
        private readonly ILogger<GodownController> logger;

        public GodownController(ILogger<GodownController> _logger, IConfiguration _Configuration)
        {
            logger = _logger;
            Configuration = _Configuration;
        }

        [HttpGet]
        public ActionResult<List<Godown>> Get(int Date)
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

                            if (Date != null && Date != 0)
                            {

                                List<GodownReport> godowns = db.Query<GodownReport>("select StockItem.Name StockItemName,sum(qty) as TotalQty from Godown " +
                                "left join StockItem on Godown.StockItemId = StockItem.Id where Godown.Date <=" + Date + " group by StockItem.Name ").ToList();
                                return Ok(godowns);
                            }
                            else
                            {
                                List<GodownReport> godowns = db.Query<GodownReport>("select StockItem.Name StockItemName,sum(qty) as TotalQty from Godown " +
                            "left join StockItem on Godown.StockItemId = StockItem.Id group by StockItem.Name ").ToList();
                                return Ok(godowns);
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
