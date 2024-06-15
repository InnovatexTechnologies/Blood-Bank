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
    public class TransfusionController : ControllerBase
    {
        private IConfiguration Configuration;
        private readonly ILogger<TransfusionController> logger;

        public TransfusionController(ILogger<TransfusionController> _logger, IConfiguration _Configuration)
        {
            logger = _logger;
            Configuration = _Configuration;
        }
        [HttpGet]
        public ActionResult<List<Transfusion>> Get()
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

                            List<Transfusion> transfusions = db.Query<Transfusion>("select Transfusion.*,nc.Name NewComponentName,pc.Name PreviousComponentName,BloodGroup.Name BloodGroupName from Transfusion " +
                                "left join Hospital on Transfusion.HospitalType = Hospital.Type " +
                                "left join PatientType on Transfusion.PatientType = PatientType.Id " +
                                "left join BloodComponents pc on Transfusion.PreviousComponentId = pc.id " +
                                "left join BloodComponents nc on Transfusion.NewComponentId = nc.id " +
                                "left join BloodGroup on Transfusion.BloodGroupId = BloodGroup.Id"
                                ).ToList();
                            return Ok(transfusions);
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
        public ActionResult<Transfusion> Get(int id)
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
                            Transfusion transfusion = db.Query<Transfusion>("select Transfusion.*,nc.Name NewComponentName,pc.Name PreviousComponentName,BloodGroup.Name BloodGroupName from Transfusion " +
                                "left join Hospital on Transfusion.HospitalType = Hospital.Type " +
                                "left join PatientType on Transfusion.PatientType = PatientType.Id " +
                                "left join BloodComponents pc on Transfusion.PreviousComponentId = pc.id " +
                                "left join BloodComponents nc on Transfusion.NewComponentId = nc.id " +
                                "left join BloodGroup on Transfusion.BloodGroupId = BloodGroup.Id " +
                                "where Transfusion.id=" + id).FirstOrDefault();
                            return Ok(transfusion);
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
        public ActionResult<Transfusion> Post(Transfusion transfusion)
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
                                transfusion.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from Transfusion");
                                db.Execute("insert into Transfusion(Id,SupplyNo,HospitalName,HospitalType,PatientType,PreviousDonorNo,PreviousComponentId,NewDonorNo,NewComponentId,Reason,BloodGroupId,Date) values(@Id,@SupplyNo,@HospitalName,@HospitalType,@PatientType,@PreviousDonorNo,@PreviousComponentId,@NewDonorNo,@NewComponentId,@Reason,@BloodGroupId,@Date)", transfusion, transaction: transaction);

                                Stock stock = new Stock();
                                stock.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from stock");
                                stock.TransType = "Transfusion";
                                stock.Date = transfusion.Date;
                                stock.RefId = transfusion.Id;
                                stock.BloodGroupId = transfusion.BloodGroupId;
                                stock.BloodComponentId = transfusion.NewComponentId;
                                stock.Qty = -1;
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
            return Ok(new { success = true, message = "Data Saved." });
        }

        [HttpPut("{id}")]
        public ActionResult<Transfusion> Put(int id, [FromBody] Transfusion transfusion)
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
                                db.Execute("update Transfusion set SupplyNo=@SupplyNo,HospitalName=@HospitalName,HospitalType=@HospitalType,PatientType=@PatientType,PreviousDonorNo=@PreviousDonorNo,PreviousComponentId=@PreviousComponentId,NewDonorNo=@NewDonorNo,NewComponentId=@NewComponentId,Reason=@Reason,BloodGroupId=@BloodGroupId,Date=@Date where Id=" + id, transfusion, transaction: transaction);

                                db.Execute("delete from stock where RefId=" + id + " and TransType = 'Transfusion'", null, transaction: transaction);

                                Stock stock = new Stock();
                                stock.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from stock");
                                stock.TransType = "Transfusion";
                                stock.Date = transfusion.Date;
                                stock.RefId = transfusion.Id;
                                stock.BloodGroupId = transfusion.BloodGroupId;
                                stock.BloodComponentId = transfusion.NewComponentId;
                                stock.Qty = -1;
                                db.Execute("insert into stock(Id,TransType,Date,RefId,BloodGroupId,BloodComponentId,Qty) values(@Id,@TransType,@Date,@RefId,@BloodGroupId,@BloodComponentId,@Qty)", stock, transaction: transaction);

                                transaction.Commit();
                                return Ok(transfusion);
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
        public ActionResult<List<Transfusion>> Delete(int id)
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
                                db.Execute("delete from Transfusion where Id=" + id);
                                db.Execute("delete from stock where RefId=" + id + " and TransType = 'Transfusion'", null, transaction: transaction);
                                transaction.Commit();
                            }
                            List<Transfusion> transfusions = db.Query<Transfusion>("select * from Transfusion").ToList();
                            return Ok(transfusions);
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
