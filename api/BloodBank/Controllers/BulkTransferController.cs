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
    public class BulkTransferController : ControllerBase
    {
        private IConfiguration Configuration;
        private readonly ILogger<BulkTransferController> logger;

        public BulkTransferController(ILogger<BulkTransferController> _logger, IConfiguration _Configuration)
        {
            logger = _logger;
            Configuration = _Configuration;
        }
        [HttpGet]
        public ActionResult<List<BulkTransfer>> Get(int fromDate, int toDate)
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

                            List<BulkTransfer> BulkTransfers = db.Query<BulkTransfer>("select BulkTransfer.*,BloodGroup.Name BloodGroupName,BloodComponents.Name BloodComponentName from BulkTransfer " +
                                "left join BloodGroup on BulkTransfer.BloodGroupId = BloodGroup.Id " +
                                "left join BloodComponents on BulkTransfer.BloodComponentId = BloodComponents.Id " +
                                "where Date>=" + fromDate + " and Date<=" + toDate).ToList();
                            return Ok(BulkTransfers);
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
        public ActionResult<BulkTransfer> Get(int id)
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
                            BulkTransfer bulkTransfer = db.Query<BulkTransfer>("select BulkTransfer.*,BloodGroup.Name BloodGroupName,BloodComponents.Name BloodComponentName from BulkTransfer " +
                                "left join BloodGroup on BulkTransfer.BloodGroupId = BloodGroup.Id " +
                                "left join BloodComponents on BulkTransfer.BloodComponentId = BloodComponents.Id where BulkTransfer.id=" + id).FirstOrDefault();
                            return Ok(bulkTransfer);
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
        public ActionResult<BulkTransfer> Post(BulkTransfer bulkTransfer)
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
                                bulkTransfer.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from BulkTransfer");
                                db.Execute("insert into BulkTransfer(Id,Date,BloodGroupId,BloodComponentId,Qty,Organisation_Company,Remark) values(@Id,@Date,@BloodGroupId,@BloodComponentId,@Qty,@Organisation_Company,@Remark)", bulkTransfer, transaction: transaction);

                                Stock stock = new Stock();
                                stock.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from stock");
                                stock.TransType = "BulkTransfer";
                                stock.Date = bulkTransfer.Date;
                                stock.RefId = bulkTransfer.Id;
                                stock.BloodGroupId = bulkTransfer.BloodGroupId;
                                stock.BloodComponentId = bulkTransfer.BloodComponentId;
                                stock.Qty = -1 * bulkTransfer.Qty;
                                db.Execute("insert into stock(Id,TransType,Date,RefId,BloodGroupId,BloodComponentId,Qty) values(@Id,@TransType,@Date,@RefId,@BloodGroupId,@BloodComponentId,@Qty)", stock, transaction: transaction);

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
        public ActionResult<BulkTransfer> Put(int id, [FromBody] BulkTransfer bulkTransfer)
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
                                db.Execute("update BulkTransfer set Date=@Date,BloodGroupId=@BloodGroupId,BloodComponentId=@BloodComponentId,Qty=@Qty,Organisation_Company=@Organisation_Company,Remark=@Remark where Id=" + id, bulkTransfer, transaction: transaction);

                                db.Execute("delete from stock where RefId=" + id + " and TransType = 'BulkTransfer'", null, transaction: transaction);

                                Stock stock = new Stock();
                                stock.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from stock");
                                stock.TransType = "BulkTransfer";
                                stock.Date = bulkTransfer.Date;
                                stock.RefId = id;
                                stock.BloodGroupId = bulkTransfer.BloodGroupId;
                                stock.BloodComponentId = bulkTransfer.BloodComponentId;
                                stock.Qty = -1 * bulkTransfer.Qty;
                                db.Execute("insert into stock(Id,TransType,Date,RefId,BloodGroupId,BloodComponentId,Qty) values(@Id,@TransType,@Date,@RefId,@BloodGroupId,@BloodComponentId,@Qty)", stock, transaction: transaction);

                                transaction.Commit();
                                return Ok(bulkTransfer);
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
        public ActionResult<List<BulkTransfer>> Delete(int id)
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
                                db.Execute("delete from BulkTransfer where Id=" + id);
                                db.Execute("delete from stock where RefId=" + id + " and TransType = 'BulkTransfer'", null, transaction: transaction);
                                transaction.Commit();
                            }
                            List<BulkTransfer> bulkTransfers = db.Query<BulkTransfer>("select * from BulkTransfer").ToList();
                            return Ok(bulkTransfers);
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
