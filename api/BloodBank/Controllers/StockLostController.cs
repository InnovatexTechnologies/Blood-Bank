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
using System.Net;

namespace BloodBank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")]
    public class StockLostController : ControllerBase
    {
        private IConfiguration Configuration;
        private readonly ILogger<StockLostController> logger;

        public StockLostController(ILogger<StockLostController> _logger, IConfiguration _Configuration)
        {
            logger = _logger;
            Configuration = _Configuration;
        }
        [HttpGet]
        public ActionResult<List<StockLost>> Get(int fromDate, int toDate, string Type)
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
                            string where = "";
                            if (!string.IsNullOrWhiteSpace(Type))
                            {
                                where += " and StockLost.Type='" + Type + "'";
                            }
                            List<StockLost> stockLosts = db.Query<StockLost>("select StockLost.*,StockItem.Name StockItemName from StockLost " +
                                  "left join StockItem on StockLost.StockItemId = StockItem.Id where StockLost.Date>=" + fromDate + " and StockLost.Date<=" + toDate + where).ToList();
                            return Ok(stockLosts);
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

        [HttpGet("{id}")]
        public ActionResult<StockLost> Get(int id)
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
                            StockLost stockLost = db.Query<StockLost>("select * from StockLost where id=" + id).FirstOrDefault();
                            return Ok(stockLost);
                        }
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
            return Ok(new { success = true });

        }


        [HttpPost]
        public ActionResult<StockLost> Post(StockLost stockLost)
        {
            try
            {
                string ConnString = this.Configuration.GetConnectionString("MyConn");

                using (SQLiteConnection db = new SQLiteConnection(ConnString))
                {
                    string Auth = Request.Headers["Auth"].FirstOrDefault() ?? "";
                    db.Open();
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
                            using (var transaction = db.BeginTransaction())
                            {
                                stockLost.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from stockLost");
                                db.Execute("insert into stockLost(Id,Date,StockItemId,Qty,Remark,Type) values(@Id,@Date,@StockItemId,@Qty,@Remark,@Type)", stockLost, transaction: transaction);

                                Godown godown = new Godown();
                                godown.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from godown");
                                godown.TransType = "StockLost";
                                godown.Date = stockLost.Date;
                                godown.RefId = stockLost.Id;
                                godown.StockItemId = stockLost.StockItemId;
                                godown.Qty = -stockLost.Qty;
                                db.Execute("insert into godown(Id,TransType,Date,RefId,StockItemId,Qty) values(@Id,@TransType,@Date,@RefId,@StockItemId,@Qty)", godown, transaction: transaction);

                                transaction.Commit();
                            }
                        }
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
            return Ok(new { success = true });
        }

        [HttpPut("{id}")]
        public ActionResult<StockLost> Put(int id, [FromBody] StockLost stockLost)
        {
            try
            {
                string ConnString = this.Configuration.GetConnectionString("MyConn");
                using (SQLiteConnection db = new SQLiteConnection(ConnString))
                {
                    string Auth = Request.Headers["Auth"].FirstOrDefault() ?? "";
                    db.Open();
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
                            using (var transaction = db.BeginTransaction())
                            {
                                db.Execute("update StockLost set Date=@Date,StockItemId=@StockItemId,Qty=@Qty,Remark=@Remark,Type=@Type where Id=" + id, stockLost, transaction: transaction);

                                db.Execute("delete from godown where RefId=" + id + " and TransType = 'StockLost'", null, transaction: transaction);

                                Godown godown = new Godown();
                                godown.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from godown");
                                godown.TransType = "StockLost";
                                godown.Date = stockLost.Date;
                                godown.RefId = id;
                                godown.StockItemId = stockLost.StockItemId;
                                godown.Qty = -stockLost.Qty;
                                db.Execute("insert into godown(Id,TransType,Date,RefId,StockItemId,Qty) values(@Id,@TransType,@Date,@RefId,@StockItemId,@Qty)", godown, transaction: transaction);

                                transaction.Commit();
                                return Ok(stockLost);
                            }
                        }
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
            return Ok(new { success = true });
        }

        [HttpDelete("{id}")]
        public ActionResult<List<StockLost>> Delete(int id)
        {
            try
            {
                string ConnString = this.Configuration.GetConnectionString("MyConn");
                using (SQLiteConnection db = new SQLiteConnection(ConnString))
                {
                    string Auth = Request.Headers["Auth"].FirstOrDefault() ?? "";
                    db.Open();
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
                            using (var transaction = db.BeginTransaction())
                            {
                                db.Execute("delete from StockLost where Id=" + id);
                                db.Execute("delete from godown where RefId=" + id + " and TransType = 'StockLost'", null, transaction: transaction);
                                transaction.Commit();
                            }
                            List<StockLost> stockLosts = db.Query<StockLost>("select * from StockLost").ToList();
                            return Ok(stockLosts);
                        }
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
            return Ok(new { success = true });
        }
    }
}
