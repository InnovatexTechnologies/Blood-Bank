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
    public class ReturnStockController : ControllerBase
    {
        private IConfiguration Configuration;
        private readonly ILogger<ReturnStockController> logger;

        public ReturnStockController(ILogger<ReturnStockController> _logger, IConfiguration _Configuration)
        {
            logger = _logger;
            Configuration = _Configuration;
        }
        [HttpGet]
        public ActionResult<List<ReturnStock>> Get(int fromDate, int toDate)
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
                            List<ReturnStock> obj = db.Query<ReturnStock>("select ReturnStock.*,Hospital.Type Type,BloodGroup.Name BloodGroupName,BloodComponents.Name BloodComponentsName,PatientType.Name PatientTypeName  from ReturnStock " +
                                "LEFT JOIN Hospital on returnStock.HospitalId = Hospital.Id " +
                                "left join BloodGroup on returnStock.BloodGroupId = BloodGroup.Id " +
                                "left join BloodComponents on returnStock.BloodComponentId = BloodComponents.Id " +
                                "left join PatientType on returnStock.PatientTypeId = PatientType.Id " +
                                "where DOR>=" + fromDate + " and DOR<=" + toDate).ToList();
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

        [HttpGet("{id}")]
        public ActionResult<ReturnStock> Get(int id)  // By parameter
        {
            ReturnStock returnStock;
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
                            returnStock = db.Query<ReturnStock>("select ReturnStock.*,Hospital.Type Type,BloodGroup.Name BloodGroupName,BloodComponents.Name BloodComponentsName,PatientType.Name PatientTypeName  from ReturnStock " +
                                "LEFT JOIN Hospital on returnStock.HospitalId = Hospital.Id " +
                                "left join BloodGroup on returnStock.BloodGroupId = BloodGroup.Id " +
                                "left join BloodComponents on returnStock.BloodComponentId = BloodComponents.Id " +
                                "left join PatientType on returnStock.PatientTypeId = PatientType.Id where ReturnStock.id=" + id).FirstOrDefault();
                            return Ok(returnStock);
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


        [HttpPost]
        public ActionResult Post(ReturnStock returnStock)
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
                            int dateToCompare = db.ExecuteScalar<int>("select ifnull(max(DOR),0) from returnStock");
                            if (returnStock.DOR >= dateToCompare)
                            {
                                using (var transaction = db.BeginTransaction())
                                {
                                    returnStock.Id = db.ExecuteScalar<int>("select ifnull(Max(Id),0)+1 from ReturnStock");

                                    db.Execute("insert into ReturnStock(ID,DOR,PatientName,HospitalId,DonorNo,BloodGroupId,Free_Paid,Amount,ReceiptNo,SupplyNo,BloodComponentId,Institution_Doctor,PatientTypeId,AgainstDonor) values(@ID,@DOR,@PatientName,@HospitalId,@DonorNo,@BloodGroupId,@Free_Paid,@Amount,@ReceiptNo,@SupplyNo,@BloodComponentId,@Institution_Doctor,@PatientTypeId,@AgainstDonor)", returnStock, transaction: transaction);

                                    Stock stock = new Stock();
                                    stock.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from stock");
                                    stock.TransType = "ReturnStock";
                                    stock.Date = returnStock.DOR;
                                    stock.RefId = returnStock.Id;
                                    stock.BloodGroupId = returnStock.BloodGroupId;
                                    stock.BloodComponentId = returnStock.BloodComponentId;
                                    stock.Qty = 1;
                                    db.Execute("insert into stock(Id,TransType,Date,RefId,BloodGroupId,BloodComponentId,Qty) values(@Id,@TransType,@Date,@RefId,@BloodGroupId,@BloodComponentId,@Qty)", stock, transaction: transaction);
                                    transaction.Commit();
                                }
                            }
                            else
                            {
                                return StatusCode(StatusCodes.Status401Unauthorized, new { success = false, message = "Entry can't be done on this date." });
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
        public ActionResult Put(int id, [FromBody] ReturnStock returnStock)
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
                                db.Execute("update ReturnStock set DOR=@DOR,PatientName=@PatientName,HospitalId=@HospitalId,DonorNo=@DonorNo,BloodGroupId=@BloodGroupId,Free_Paid=@Free_Paid,Amount=@Amount,ReceiptNo=@ReceiptNo,SupplyNo=@SupplyNo,BloodComponentId=@BloodComponentId,Institution_Doctor=@Institution_Doctor,PatientTypeId=@PatientTypeId,AgainstDonor=@AgainstDonor where Id =" + id, returnStock, transaction: transaction);

                                db.Execute("delete from stock where RefId=" + id + " and TransType = 'ReturnStock'", null, transaction: transaction);

                                Stock stock = new Stock();
                                stock.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from stock");
                                stock.TransType = "ReturnStock";
                                stock.Date = returnStock.DOR;
                                stock.RefId = id;
                                stock.BloodGroupId = returnStock.BloodGroupId;
                                stock.BloodComponentId = returnStock.BloodComponentId;
                                stock.Qty = 1;
                                db.Execute("insert into stock(Id,TransType,Date,RefId,BloodGroupId,BloodComponentId,Qty) values(@Id,@TransType,@Date,@RefId,@BloodGroupId,@BloodComponentId,@Qty)", stock, transaction: transaction);

                                transaction.Commit();
                                return Ok(returnStock);
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
        public ActionResult Delete(int id)
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
                                db.Execute("delete from ReturnStock where Id =" + id, null, transaction: transaction);
                                db.Execute("delete from stock where RefId=" + id + " and TransType = 'ReturnStock'", null, transaction: transaction);
                                transaction.Commit();
                            }
                            List<ReturnStock> returnStocks = db.Query<ReturnStock>("select * from returnStock").ToList();
                            return Ok(returnStocks);

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
            return Ok(new { success = true, message = "Data Deleted." });
        }


    }
}
