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
    public class BagTypeController : ControllerBase
    {
        private IConfiguration Configuration;
        private readonly ILogger<BagTypeController> logger;

        public BagTypeController(ILogger<BagTypeController> _logger, IConfiguration _Configuration)
        {
            logger = _logger;
            Configuration = _Configuration;
        }
        [HttpGet]
        public ActionResult<List<BagType>> Get()
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

                            List<BagType> bagTypes = db.Query<BagType>("select * from bagType order by DisplayIndex").ToList();
                            return Ok(bagTypes);
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
        public ActionResult<BagType> Get(int id)
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
                            BagType bagType = db.Query<BagType>("select * from bagType where id=" + id).FirstOrDefault();
                            bagType.bagTypeConsumptions = db.Query<BagTypeConsumption>("select BagTypeConsumption.*,StockItem.Name StockItemName from BagTypeConsumption " +
                                "left join StockItem on BagTypeConsumption.StockItemId = StockItem.Id where bagtypeid=" + id).ToList();
                            return Ok(bagType);
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
        public ActionResult<BagType> Post(BagType bagType)
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
                                bagType.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from bagType");
                                db.Execute("insert into bagType(Id,Name,DisplayIndex,Components,Qty) values(@Id,@Name,@DisplayIndex,@Components,@Qty)", bagType,transaction:transaction);
                                foreach(var item in bagType.bagTypeConsumptions)
                                {
                                    item.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from BagTypeConsumption");
                                    item.BagTypeId = bagType.Id;
                                    db.Execute("insert into BagTypeConsumption(Id,BagTypeId,StockItemId,Qty) values(@Id,@BagTypeId,@StockItemId,@Qty)", item, transaction: transaction);
                                }
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
        public ActionResult<BagType> Put(int id, [FromBody] BagType bagType)
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
                                db.Execute("update BagType set Name=@Name,DisplayIndex=@DisplayIndex,Components=@Components,Qty=@Qty where Id=" + id, bagType,transaction : transaction);

                                db.Execute("delete from BagTypeConsumption where BagTypeId=" + id,null,transaction:transaction);

                                foreach (var item in bagType.bagTypeConsumptions)
                                {
                                    item.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from BagTypeConsumption");
                                    item.BagTypeId = id;

                                    db.Execute("insert into BagTypeConsumption(Id,BagTypeId,StockItemId,Qty) values(@Id,@BagTypeId,@StockItemId,@Qty)", item, transaction: transaction);
                                }

                                transaction.Commit();
                                return Ok(bagType);
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
        public ActionResult<List<BagType>> Delete(int id)
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
                            int count = db.ExecuteScalar<int>("select count(*) from donor where BagTypeId=" + id);
                            if (count == 0)
                            {
                                using (var transaction = db.BeginTransaction())
                                {
                                    db.Execute("delete from BagType where Id=" + id, null, transaction: transaction);
                                    db.Execute("delete from BagTypeConsumption where BagTypeId=" + id, null, transaction: transaction);
                                    transaction.Commit();
                                }
                                List<BagType> bagTypes = db.Query<BagType>("select * from bagType").ToList();
                                return Ok(bagTypes);
                            }
                            else
                            {
                                return StatusCode(StatusCodes.Status401Unauthorized, new { success = false, message = "Bag Type in use." });
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
    }
}
