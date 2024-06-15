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
    public class ExpireStockController : Controller
    {
        private IConfiguration Configuration;
        private readonly ILogger<ExpireStockController> logger;

        public ExpireStockController(ILogger<ExpireStockController> _logger, IConfiguration _Configuration)
        {
            logger = _logger;
            Configuration = _Configuration;
        }
        [HttpGet]
        public ActionResult<List<ExpireStock>> Get(int FromDate, int ToDate)
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
                            //List<ExpireStock> obj = db.Query<ExpireStock>("SELECT pb.dod, pb.donorno, pb.name," +
                            //    " sum(pb.Qty) Qty FROM (select Donor.DOD, Donor.DonorNo,Donor.Name, 1 Qty from Donor" +
                            //    " left JOIN Stock on Stock.RefId = Donor.Id" +
                            //    " where Stock.TransType = 'Donation' and Stock.BloodComponentId = 3" +
                            //    " UNION all" +
                            //    " select Donor.DOD, Donor.DonorNo, Donor.Name, -1 Qty from Issue" +
                            //    " inner JOIN Donor on Donor.DonorNo = Issue.DonorNo where BloodComponentId=3) PB " +
                            //    " where pb.dod>="+FromDate+" and pb.dod<="+ToDate+" " +
                            //    " GROUP by pb.dod, pb.donorno, pb.name HAVING sum(pb.Qty)!=0").ToList();

                            //List<ExpireStock> obj = db.Query<ExpireStock>("SELECT pb.dod, pb.donorno, pb.name," +
                            //    " sum(pb.Qty) Qty FROM (select Donor.DOD, Donor.DonorNo,Donor.Name, 1 Qty from Donor" +
                            //    " left JOIN Stock on Stock.RefId = Donor.Id" +
                            //    " left JOIN DiscardBlood on Donor.DonorNo = DiscardBlood.Donorno" +
                            //    " where Stock.TransType = 'Donation' and Stock.BloodComponentId = 3  and DiscardBlood.DiscardType is not 'Expire'" +
                            //    " UNION all" +
                            //    " select Donor.DOD, Donor.DonorNo, Donor.Name, -1 Qty from Issue" +
                            //    " inner JOIN Donor on Donor.DonorNo = Issue.DonorNo where BloodComponentId=3) PB " +
                            //    " where pb.dod>=" + FromDate + " and pb.dod<=" + ToDate + " " +
                            //    " GROUP by pb.dod, pb.donorno, pb.name HAVING sum(pb.Qty)!=0").ToList();

                            //List<ExpireStock> obj = db.Query<ExpireStock>("SELECT pb.Id, pb.dod, pb.donorno, pb.name,(select name from BloodGroup where Id == pb.BloodGroupId) as BloodGroupName," +
                            //    " sum(pb.Qty) Qty FROM (select Donor.Id, Donor.DOD, Donor.DonorNo,Donor.Name,Donor.BloodGroupId, 1 Qty from Donor" +
                            //    " left JOIN Stock on Stock.RefId = Donor.Id" +
                            //    " left JOIN DiscardBlood on Donor.DonorNo = DiscardBlood.Donorno" +
                            //    " where Stock.TransType = 'Donation' and Stock.BloodComponentId = 3  and DiscardBlood.DiscardType is not 'Expire' and Donor.UseStatus !=1 " +
                            //    " UNION all" +
                            //    " select Donor.Id, Donor.DOD, Donor.DonorNo, Donor.Name,Donor.BloodGroupId, -1 Qty from Issue" +
                            //    " inner JOIN Donor on Donor.DonorNo = Issue.DonorNo inner JOIN BloodGroup on BloodGroup.Id = Donor.BloodGroupId where BloodComponentId=3) PB " +
                            //    " where pb.dod>=" + FromDate + " and pb.dod<=" + ToDate + " " +
                            //    " GROUP by pb.dod, pb.donorno, pb.name HAVING sum(pb.Qty)!=0").ToList();

                            //                        List<ExpireStock> obj = db.Query<ExpireStock>("SELECT pb.Id, pb.dod, pb.donorno, " +
                            //"CASE WHEN CHARINDEX('S/', pb.name) = 0 THEN pb.name ELSE NULL END as name, " +
                            //"(select name from BloodGroup where Id == pb.BloodGroupId) as BloodGroupName," +
                            //" sum(pb.Qty) Qty FROM (select Donor.Id, Donor.DOD, Donor.DonorNo,Donor.Name,Donor.BloodGroupId, 1 Qty from Donor" +
                            //" left JOIN Stock on Stock.RefId = Donor.Id" +
                            //" left JOIN DiscardBlood on Donor.DonorNo = DiscardBlood.Donorno" +
                            //" where Stock.TransType = 'Donation' and Stock.BloodComponentId = 3  and DiscardBlood.DiscardType is not 'Expire' and Donor.UseStatus !=1 " +
                            //" UNION all" +
                            //" select Donor.Id, Donor.DOD, Donor.DonorNo, Donor.Name,Donor.BloodGroupId, -1 Qty from Issue" +
                            //" inner JOIN Donor on Donor.DonorNo = Issue.DonorNo inner JOIN BloodGroup on BloodGroup.Id = Donor.BloodGroupId where BloodComponentId=3) PB " +
                            //" where pb.dod >= " + FromDate + " and pb.dod <= " + ToDate +
                            //" AND CHARINDEX('S/', pb.name) = 0" +
                            //" AND pb.name IS NOT NULL" + 
                            //" GROUP by pb.dod, pb.donorno, pb.name HAVING sum(pb.Qty) != 0").ToList();

                            List<ExpireStock> obj = db.Query<ExpireStock>("SELECT pb.Id, pb.dod, pb.donorno, " +
    "CASE WHEN CHARINDEX('S/', pb.name) = 0 THEN pb.name ELSE NULL END as name, " +
    "(select name from BloodGroup where Id == pb.BloodGroupId) as BloodGroupName," +
    " sum(pb.Qty) Qty FROM (select Donor.Id, Donor.DOD, Donor.DonorNo,Donor.Name,Donor.BloodGroupId, 1 Qty from Donor" +
    " left JOIN Stock on Stock.RefId = Donor.Id" +
    " left JOIN DiscardBlood on Donor.DonorNo = DiscardBlood.Donorno" +
    " where Stock.TransType = 'Donation' and Stock.BloodComponentId = 3  and DiscardBlood.DiscardType is not 'Expire' and Donor.UseStatus !=1 " +
    " UNION all" +
    " select Donor.Id, Donor.DOD, Donor.DonorNo, Donor.Name,Donor.BloodGroupId, -1 Qty from Issue" +
    " inner JOIN Donor on Donor.DonorNo = Issue.DonorNo inner JOIN BloodGroup on BloodGroup.Id = Donor.BloodGroupId where BloodComponentId=3) PB " +
    " where pb.dod >= " + FromDate + " and pb.dod <= " + ToDate +
    " AND CHARINDEX('S/', pb.name) = 0" +
    " AND pb.name IS NOT NULL" +
    " GROUP by pb.dod, pb.donorno, pb.name HAVING sum(pb.Qty) NOT IN (0,-1, -2,-3)").ToList();


                            obj = obj.Where(abc => abc.exp < int.Parse(DateTime.Now.ToString("yyyyMMdd"))).ToList();

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
        [HttpPost]
        public ActionResult Post(DiscardBlood discardBlood, int Id)
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
                                List<string> items = new List<string>();

                                Donar donar = db.Query<Donar>("select * from Donor where Id = " + Id).FirstOrDefault();

                                discardBlood.Id = db.ExecuteScalar<int>("select ifnull(Max(Id),0)+1 from DiscardBlood");
                                discardBlood.Reason = "Discard";
                                discardBlood.BloodGroupId = donar.BloodGroupId;
                                discardBlood.Donorno = int.Parse(donar.DonorNo);
                                discardBlood.DiscardType = "Expire";
                                discardBlood.BagTypeId = donar.BagTypeId;
                                discardBlood.Date = int.Parse(donar.DOD.ToDate().AddDays(7).ToString("yyyyMMdd"));
                                discardBlood.BasedOn = "Component";
                                discardBlood.BloodComponentId = 3;
                                db.Execute("insert into DiscardBlood(Id,Reason,BloodGroupId,Donorno,DiscardType,BagTypeId,Date,BasedOn,BloodComponentId) values(@Id,@Reason,@BloodGroupId,@Donorno,@DiscardType,@BagTypeId,@Date,@BasedOn,@BloodComponentId)", discardBlood, transaction: transaction);
                                items.Add(discardBlood.BloodComponentId.ToString());

                                foreach (var item in items)
                                {
                                    Stock stock = new Stock();
                                    stock.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from stock");
                                    stock.TransType = "DiscardStock";
                                    stock.Date = discardBlood.Date;
                                    stock.RefId = discardBlood.Id;
                                    stock.BloodGroupId = discardBlood.BloodGroupId;
                                    stock.BagTypeId = discardBlood.BagTypeId;
                                    stock.BloodComponentId = discardBlood.BloodComponentId;
                                    stock.Qty = -1;
                                    stock.DonorNumber = discardBlood.Donorno.ToString();
                                    db.Execute("insert into stock(Id,TransType,Date,RefId,BloodGroupId,BagTypeId,BloodComponentId,Qty,DonorNumber) values(@Id,@TransType,@Date,@RefId,@BloodGroupId,@BagTypeId,@BloodComponentId,@Qty,@DonorNumber)", stock, transaction: transaction);
                                }

                                db.Execute("update Donor Set UseStatus=1 where Id="+donar.Id, donar);

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
    }
}