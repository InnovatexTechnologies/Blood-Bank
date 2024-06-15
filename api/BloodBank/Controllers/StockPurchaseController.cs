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
    public class StockPurchaseController : ControllerBase
    {
        private IConfiguration Configuration;
        private readonly ILogger<StockPurchaseController> logger;

        public StockPurchaseController(ILogger<StockPurchaseController> _logger, IConfiguration _Configuration)
        {
            logger = _logger;
            Configuration = _Configuration;
        }
        [HttpGet]
        public ActionResult<List<StockPurchase>> Get(int fromDate, int toDate, string StockItemId = "")
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
                            string strWhere = "";


                            if (!string.IsNullOrEmpty(StockItemId) && StockItemId != "\"\"")
                            {
                                strWhere += " and StockPurchase.StockItemId=" + "'" + StockItemId + "' ";
                            }
                            List<StockPurchase> stockPurchases = db.Query<StockPurchase>("select StockPurchase.*,StockItem.Name StockItemName from StockPurchase " +
                                "left join StockItem on StockPurchase.StockItemId = StockItem.Id where StockPurchase.Date>=" + fromDate + " and StockPurchase.Date<=" + toDate + strWhere).ToList();
                            return Ok(stockPurchases);
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
        public ActionResult<StockPurchase> Get(int id)
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
                            StockPurchase stockPurchase = db.Query<StockPurchase>("select * from StockPurchase where id=" + id).FirstOrDefault();
                            return Ok(stockPurchase);
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
        public ActionResult<StockPurchase> Post(StockPurchase stockPurchase)
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
                                stockPurchase.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from StockPurchase");
                                db.Execute("insert into StockPurchase(Id,Date,StockItemId,Qty,Remark) values(@Id,@Date,@StockItemId,@Qty,@Remark)", stockPurchase, transaction: transaction);

                                //StockItem stockItem = db.Query<StockItem>("select * from stockitem where id=" + stockPurchase.StockItemId).FirstOrDefault();

                                Godown godown = new Godown();
                                godown.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from godown");
                                godown.TransType = "StockPurchase";
                                godown.Date = stockPurchase.Date;
                                godown.RefId = stockPurchase.Id;
                                godown.StockItemId = stockPurchase.StockItemId;
                                godown.Qty = stockPurchase.Qty;
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
        public ActionResult<StockPurchase> Put(int id, [FromBody] StockPurchase stockPurchase)
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
                                db.Execute("update StockPurchase set Date=@Date,StockItemId=@StockItemId,Qty=@Qty,Remark=@Remark where Id=" + id, stockPurchase, transaction: transaction);

                                db.Execute("delete from godown where RefId=" + id + " and TransType = 'StockPurchase'", null, transaction: transaction);

                                Godown godown = new Godown();
                                godown.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from godown");
                                godown.TransType = "StockPurchase";
                                godown.Date = stockPurchase.Date;
                                godown.RefId = id;
                                godown.StockItemId = stockPurchase.StockItemId;
                                godown.Qty = stockPurchase.Qty;
                                db.Execute("insert into godown(Id,TransType,Date,RefId,StockItemId,Qty) values(@Id,@TransType,@Date,@RefId,@StockItemId,@Qty)", godown, transaction: transaction);

                                transaction.Commit();
                                return Ok(stockPurchase);
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
        public ActionResult<List<StockPurchase>> Delete(int id)
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
                                db.Execute("delete from StockPurchase where Id=" + id);
                                db.Execute("delete from godown where RefId=" + id + " and TransType = 'StockPurchase'", null, transaction: transaction);
                                transaction.Commit();
                            }
                            List<StockPurchase> stockPurchases = db.Query<StockPurchase>("select * from StockPurchase").ToList();
                            return Ok(stockPurchases);
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
