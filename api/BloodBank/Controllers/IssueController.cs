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
    public class IssueController : ControllerBase
    {
        private IConfiguration Configuration;
        private readonly ILogger<IssueController> logger;

        public IssueController(ILogger<IssueController> _logger, IConfiguration _Configuration)
        {
            logger = _logger;
            Configuration = _Configuration;
        }
        [HttpGet]
        public ActionResult<List<Issue>> Get(string BloodGroupId, string BloodComponentId, int fromDate, int toDate, string patientType = "", string hospitalType = "", string PaymentMode = "", string Replacement = "")
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

                            if (!string.IsNullOrWhiteSpace(patientType))
                            {
                                strWhere += " and PatientTypeId=" + patientType;
                            }

                            if (!string.IsNullOrWhiteSpace(hospitalType))
                            {
                                strWhere += " and HospitalId=" + hospitalType;
                            }

                            if (!string.IsNullOrWhiteSpace(PaymentMode))
                            {
                                strWhere += " and Free_Paid=" + "'" + PaymentMode + "' ";
                            }

                            if (!string.IsNullOrWhiteSpace(Replacement))
                            {
                                strWhere += " and AgainstDonor=" + "'" + Replacement + "' ";
                            }
                            if (!string.IsNullOrWhiteSpace(BloodGroupId))
                            {
                                strWhere += " and Issue.BloodGroupId=" + "'" + BloodGroupId + "' ";
                            }
                            if (!string.IsNullOrWhiteSpace(BloodComponentId))
                            {
                                strWhere += " and Issue.BloodComponentId=" + "'" + BloodComponentId + "' ";
                            }

                            List<Issue> obj = db.Query<Issue>("select Issue.*,Hospital.Type Type,BloodGroup.Name BloodGroupName,BloodComponents.Name BloodComponentsName,PatientType.Name PatientTypeName  from Issue " +
                                "LEFT JOIN Hospital on issue.HospitalId = Hospital.Id " +
                                "left join BloodGroup on issue.BloodGroupId = BloodGroup.Id " +
                                "left join BloodComponents on issue.BloodComponentId = BloodComponents.Id " +
                                "left join PatientType on issue.PatientTypeId = PatientType.Id " +
                                "where DOI>=" + fromDate + " and DOI<=" + toDate + strWhere).ToList();
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
        public ActionResult<Issue> Get(int id)  // By parameter
        {
            Issue issue;
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
                            issue = db.Query<Issue>("select Issue.*,Hospital.Type Type,BloodGroup.Name BloodGroupName,BloodComponents.Name BloodComponentsName,PatientType.Name PatientTypeName  from Issue " +
                                "LEFT JOIN Hospital on issue.HospitalId = Hospital.Id " +
                                "left join BloodGroup on issue.BloodGroupId = BloodGroup.Id " +
                                "left join BloodComponents on issue.BloodComponentId = BloodComponents.Id " +
                                "left join PatientType on issue.PatientTypeId = PatientType.Id where Issue.id=" + id).FirstOrDefault();
                            return Ok(issue);
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
        public ActionResult Post(Issue issue)
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
                            int dateToCompare = db.ExecuteScalar<int>("select ifnull(max(DOI),strftime('%Y%m%d', 'now')) from issue");
                            int maxDate = int.Parse(DateTime.Now.ToString("yyyyMMdd"));
                            if (issue.DOI >= dateToCompare && issue.DOI <= maxDate)
                            {
                                using (var transaction = db.BeginTransaction())
                                {
                                    issue.Id = db.ExecuteScalar<int>("select ifnull(Max(Id),0)+1 from Issue");
                                    issue.SupplyNo = db.ExecuteScalar<int>("select ifnull(max(SupplyNo),0)+1 from issue");
                                    db.Execute("insert into Issue(ID,DOI,PatientName,HospitalId,DonorNo,BloodGroupId,Free_Paid,Amount,ReceiptNo,SupplyNo,BloodComponentId,Institution_Doctor,PatientTypeId,AgainstDonor,Remark) values(@ID,@DOI,@PatientName,@HospitalId,@DonorNo,@BloodGroupId,@Free_Paid,@Amount,@ReceiptNo,@SupplyNo,@BloodComponentId,@Institution_Doctor,@PatientTypeId,@AgainstDonor,@Remark)", issue, transaction: transaction);

                                    Stock stock = new Stock();
                                    stock.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from stock");
                                    stock.TransType = "Issue";
                                    stock.Date = issue.DOI;
                                    stock.RefId = issue.Id;
                                    stock.BloodGroupId = issue.BloodGroupId;
                                    stock.BloodComponentId = issue.BloodComponentId;
                                    stock.DonorNumber = issue.DonorNo;
                                    stock.Qty = -1;
                                    db.Execute("insert into stock(Id,TransType,Date,RefId,BloodGroupId,BloodComponentId,DonorNumber,Qty) values(@Id,@TransType,@Date,@RefId,@BloodGroupId,@BloodComponentId,@DonorNumber,@Qty)", stock, transaction: transaction);
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
        public ActionResult Put(int id, [FromBody] Issue issue)
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
                            int dateToCompare = db.ExecuteScalar<int>("select ifnull(max(DOI),strftime('%Y%m%d', 'now')) from issue");
                            int maxDate = int.Parse(DateTime.Now.ToString("yyyyMMdd"));
                            //if (issue.DOI >= dateToCompare && issue.DOI <= maxDate)
                            //{
                            using (var transaction = db.BeginTransaction())
                            {
                                db.Execute("update Issue set DOI=@DOI,PatientName=@PatientName,HospitalId=@HospitalId,DonorNo=@DonorNo,BloodGroupId=@BloodGroupId,Free_Paid=@Free_Paid,Amount=@Amount,ReceiptNo=@ReceiptNo,BloodComponentId=@BloodComponentId,Institution_Doctor=@Institution_Doctor,PatientTypeId=@PatientTypeId,AgainstDonor=@AgainstDonor,Remark=@Remark where Id =" + id, issue, transaction: transaction);

                                db.Execute("delete from stock where RefId=" + id + " and TransType = 'Issue'", null, transaction: transaction);

                                Stock stock = new Stock();
                                stock.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from stock");
                                stock.TransType = "Issue";
                                stock.Date = issue.DOI;
                                stock.RefId = id;
                                stock.BloodGroupId = issue.BloodGroupId;
                                stock.BloodComponentId = issue.BloodComponentId;
                                stock.DonorNumber = issue.DonorNo;
                                stock.Qty = -1;
                                db.Execute("insert into stock(Id,TransType,Date,RefId,BloodGroupId,BloodComponentId,DonorNumber,Qty) values(@Id,@TransType,@Date,@RefId,@BloodGroupId,@BloodComponentId,@DonorNumber,@Qty)", stock, transaction: transaction);

                                transaction.Commit();
                                return Ok(issue);
                            }
                            //}
                            //else
                            //{
                            //    return StatusCode(StatusCodes.Status401Unauthorized, new { success = false, message = "Entry can't be done on this date." });
                            //}
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
                                db.Execute("delete from Issue where Id =" + id);
                                db.Execute("delete from stock where RefId=" + id + " and TransType = 'Issue'", null, transaction: transaction);
                                transaction.Commit();
                            }
                            List<Issue> issues = db.Query<Issue>("select * from issue").ToList();
                            return Ok(issues);

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
