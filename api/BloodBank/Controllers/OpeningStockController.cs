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
using System.Net;
using System.Threading.Tasks;

namespace BloodBank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")]

    public class OpeningStockController : ControllerBase
    {
        private IConfiguration Configuration;
        private readonly ILogger<OpeningStockController> logger;

        public OpeningStockController(ILogger<OpeningStockController> _logger, IConfiguration _Configuration)
        {
            logger = _logger;
            Configuration = _Configuration;
        }


        [HttpGet]
        public ActionResult<List<OpeningStock>> Get()
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

                            List<OpeningStock> openingStocks = db.Query<OpeningStock>("select openingStock.*,BloodGroup.Name BloodGroupName,BloodComponents.Name BloodComponentName from openingStock " +
                                "left join BloodGroup on openingStock.BloodGroupId = BloodGroup.Id " +
                                "left join BloodComponents on openingStock.BloodComponentId = BloodComponents.Id").ToList();
                            return Ok(openingStocks);
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
        public ActionResult<OpeningStock> Get(int id)
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
                            OpeningStock openingStock = db.Query<OpeningStock>("select openingStock.*,BloodGroup.Name BloodGroupName,BloodComponents.Name BloodComponentName from openingStock " +
                                "left join BloodGroup on openingStock.BloodGroupId = BloodGroup.Id " +
                                "left join BloodComponents on openingStock.BloodComponentId = BloodComponents.Id where openingStock.id=" + id).FirstOrDefault();
                            return Ok(openingStock);
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
        public ActionResult<OpeningStock> Post(OpeningStock openingStock)
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
                                openingStock.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from openingStock");
                                //db.Execute("insert into openingStock(Id,BloodGroupId,BloodComponentId,Qty,Date) values(@Id,@BloodGroupId,@BloodComponentId,@Qty,@Date)", openingStock, transaction: transaction);
                                db.Execute("insert into openingStock(Id,BloodGroupId,BloodComponentId,Date,DonorNo) values(@Id,@BloodGroupId,@BloodComponentId,@Date,@DonorNo)", openingStock, transaction: transaction);

                                Stock stock = new Stock();
                                stock.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from stock");
                                stock.TransType = "OpeningStock";
                                stock.Date = openingStock.Date;
                                stock.RefId = openingStock.Id;
                                stock.BloodGroupId = openingStock.BloodGroupId;
                                stock.BloodComponentId = openingStock.BloodComponentId;
                                //stock.Qty = openingStock.Qty;
                                stock.Qty = 1;
                                stock.DonorNumber = openingStock.DonorNo;
                                db.Execute("insert into stock(Id,TransType,Date,RefId,BloodGroupId,BloodComponentId,Qty,DonorNumber) values(@Id,@TransType,@Date,@RefId,@BloodGroupId,@BloodComponentId,@Qty,@DonorNumber)", stock, transaction: transaction);
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
        public ActionResult<OpeningStock> Put(int id, [FromBody] OpeningStock openingStock)
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
                                //db.Execute("update OpeningStock set BloodGroupId=@BloodGroupId,BloodComponentId=@BloodComponentId,Qty=@Qty,Date=@Date where Id=" + id, openingStock, transaction: transaction);
                                db.Execute("update OpeningStock set BloodGroupId=@BloodGroupId,BloodComponentId=@BloodComponentId,Date=@Date,DonorNo=@DonorNo where Id=" + id, openingStock, transaction: transaction);

                                db.Execute("delete from stock where RefId=" + id + " and TransType = 'OpeningStock'", null, transaction: transaction);

                                Stock stock = new Stock();
                                stock.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from stock");
                                stock.TransType = "OpeningStock";
                                stock.Date = openingStock.Date;
                                stock.RefId = id;
                                stock.BloodGroupId = openingStock.BloodGroupId;
                                stock.BloodComponentId = openingStock.BloodComponentId;
                                //stock.Qty = openingStock.Qty;
                                stock.Qty = 1;
                                stock.DonorNumber = openingStock.DonorNo;
                                db.Execute("insert into stock(Id,TransType,Date,RefId,BloodGroupId,BloodComponentId,Qty,DonorNumber) values(@Id,@TransType,@Date,@RefId,@BloodGroupId,@BloodComponentId,@Qty,@DonorNumber)", stock, transaction: transaction);

                                transaction.Commit();
                                return Ok(openingStock);
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
        public ActionResult<List<OpeningStock>> Delete(int id)
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
                            db.Execute("delete from OpeningStock where Id=" + id);
                            db.Execute("delete from stock where RefId=" + id + " and TransType = 'OpeningStock'");
                            List<OpeningStock> openingStocks = db.Query<OpeningStock>("select * from openingStock").ToList();
                            return Ok(openingStocks);
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
