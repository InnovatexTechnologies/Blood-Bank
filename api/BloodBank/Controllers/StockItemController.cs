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
    public class StockItemController : ControllerBase
    {
        private IConfiguration Configuration;
        private readonly ILogger<StockItemController> logger;

        public StockItemController(ILogger<StockItemController> _logger, IConfiguration _Configuration)
        {
            logger = _logger;
            Configuration = _Configuration;
        }
        [HttpGet]
        public ActionResult<List<StockItem>> Get()
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

                            List<StockItem> stockItems = db.Query<StockItem>("select * from stockItem").ToList();
                            return Ok(stockItems);
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
        public ActionResult<StockItem> Get(int id)
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
                            StockItem stockItem = db.Query<StockItem>("select * from stockItem where id=" + id).FirstOrDefault();
                            return Ok(stockItem);
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
        public ActionResult<StockItem> Post(StockItem stockItem)
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
                                stockItem.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from stockItem");
                                db.Execute("insert into stockItem(Id,Name,OpeningStock,Date) values(@Id,@Name,@OpeningStock,@Date)", stockItem, transaction: transaction);

                                Godown godown = new Godown();
                                godown.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from godown");
                                godown.TransType = "OpeningStock";
                                godown.Date = stockItem.Date;
                                godown.RefId = stockItem.Id;
                                godown.StockItemId = stockItem.Id;
                                godown.Qty = stockItem.OpeningStock;
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
            return Ok(new { success = true, message = "Data Saved." });
        }

        [HttpPut("{id}")]
        public ActionResult<StockItem> Put(int id, [FromBody] StockItem stockItem)
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
                                db.Execute("update StockItem set Name=@Name,OpeningStock=@OpeningStock,Date=@Date where Id=" + id, stockItem, transaction: transaction);

                                db.Execute("delete from godown where RefId=" + id + " and TransType = 'OpeningStock'", null, transaction: transaction);

                                Godown godown = new Godown();
                                godown.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from godown");
                                godown.TransType = "OpeningStock";
                                godown.Date = stockItem.Date;
                                godown.RefId = id;
                                godown.StockItemId = id;
                                godown.Qty = stockItem.OpeningStock;
                                db.Execute("insert into godown(Id,TransType,Date,RefId,StockItemId,Qty) values(@Id,@TransType,@Date,@RefId,@StockItemId,@Qty)", godown, transaction: transaction);

                                transaction.Commit();
                                return Ok(stockItem);
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
            return Ok(new { success = true, message = "Data Updated." });
        }

        [HttpDelete("{id}")]
        public ActionResult<List<StockItem>> Delete(int id)
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
                            int count = db.ExecuteScalar<int>("select count(*) from StockPurchase where stockItemId=" + id);
                            if (count == 0)
                            {
                                using (var transaction = db.BeginTransaction())
                                {
                                    db.Execute("delete from StockItem where Id=" + id, null, transaction: transaction);
                                    db.Execute("delete from godown where RefId=" + id + " and TransType = 'OpeningStock'", null, transaction: transaction);
                                    transaction.Commit();
                                }
                            }
                            else
                            {
                                return StatusCode(StatusCodes.Status401Unauthorized, new { success = false, message = "StockItem in use." });
                            }

                            List<StockItem> stockItems = db.Query<StockItem>("select * from stockItem").ToList();
                            return Ok(stockItems);
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
