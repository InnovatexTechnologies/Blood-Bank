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

    public class DiscardBloodController : ControllerBase
    {
        private IConfiguration Configuration;
        private readonly ILogger<DiscardBloodController> logger;

        public DiscardBloodController(ILogger<DiscardBloodController> _logger, IConfiguration _Configuration)
        {
            logger = _logger;
            Configuration = _Configuration;
        }

        [HttpGet]
        public ActionResult<List<DiscardBlood>> Get(string BagTypeId,int FromDate, int ToDate, string BloodGroupId, string BloodComponentId, string DiscardType = "", string Reason = "", string Gender = "", string DonationType = "")
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

                            if (!string.IsNullOrWhiteSpace(DiscardType))
                            {
                                strWhere += " and DiscardBlood.DiscardType='" + DiscardType + "'";
                            }
                            if (!string.IsNullOrWhiteSpace(Reason))
                            {
                                strWhere += " and DiscardBlood.Reason='" + Reason + "'";
                            }
                            if (!string.IsNullOrWhiteSpace(Gender))
                            {
                                strWhere += " and Donor.Gender=" + "'" + Gender + "'";
                            }
                            if (!string.IsNullOrWhiteSpace(DonationType))
                            {
                                strWhere += " and DonationType.Id=" + DonationType;
                            }
                            if (!string.IsNullOrWhiteSpace(BloodGroupId))
                            {
                                strWhere += " and DiscardBlood.BloodGroupId=" + "'" + BloodGroupId + "' ";
                            }
                            if (!string.IsNullOrWhiteSpace(BagTypeId))
                            {
                                strWhere += " and DiscardBlood.BagTypeId=" + BagTypeId;
                            }
                            if (!string.IsNullOrWhiteSpace(BloodComponentId))
                            {
                                strWhere += " and DiscardBlood.BloodComponentId=" + "'" + BloodComponentId + "' ";
                            }

                            //List<DiscardBlood> obj = db.Query<DiscardBlood>("select DiscardBlood.*,BloodGroup.Name BloodGroupName,BagType.Name BagTypeName from DiscardBlood " +
                            //    "left join BloodGroup on DiscardBlood.BloodGroupId = BloodGroup.Id " +
                            //    "left join BagType on DiscardBlood.BagTypeId = BagType.Id").ToList();

                            List<DiscardBlood> obj = db.Query<DiscardBlood>("select DiscardBlood.*,BloodComponents.Name as BloodComponentName,BloodGroup.Name BloodGroupName," +
                                " BagType.Name BagTypeName, Donor.Name, Donor.Address, Donor.Mobile," +
                                " Donor.DOD, DonationType.Name as DonationType, Donor.Gender from DiscardBlood" +
                                " left join BloodGroup on BloodGroup.Id== DiscardBlood.BloodGroupId" +
                                " left join BagType on BagType.Id== DiscardBlood.BagTypeId" +
                                " left join Donor on Donor.DonorNo== DiscardBlood.Donorno" +
                                " left join BloodComponents on DiscardBlood.BloodComponentId== BloodComponents.Id " +
                                " left join DonationType on Donor.DonationTypeId== DonationType.Id" +
                                " where DiscardBlood.Date>=" + FromDate + " and DiscardBlood.Date<=" + ToDate + strWhere).ToList();
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
        public ActionResult<DiscardBlood> Get(int id)  // By parameter
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
                            DiscardBlood voucherType = db.Query<DiscardBlood>("select DiscardBlood.*,BloodGroup.Name BloodGroupName,BagType.Name BagTypeName from DiscardBlood " +
                                "left join BloodGroup on DiscardBlood.BloodGroupId = BloodGroup.Id " +
                                "left join BagType on DiscardBlood.BagTypeId = BagType.Id where DiscardBlood.id=" + id).FirstOrDefault();
                            return Ok(voucherType);
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
            return Ok(new { success = true });
        }

        [HttpPost]
        public ActionResult Post(DiscardBlood discardBlood)
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
                                

                                //List<BagTypeConsumption> bagTypeConsumptions = db.Query<BagTypeConsumption>("select * from BagTypeConsumption where BagTypeId=" + discardBlood.BagTypeId).ToList();
                                //foreach (var item in bagTypeConsumptions)
                                //{
                                //    if (item.Qty > 0)
                                //    {
                                //        StockItem stockItem = db.Query<StockItem>("select id from StockItem where id=" + item.StockItemId).FirstOrDefault();
                                //        Godown godown = new Godown();
                                //        godown.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from godown");
                                //        godown.TransType = "DiscardStock";
                                //        godown.Date = discardBlood.Date;
                                //        godown.RefId = discardBlood.Id;
                                //        godown.StockItemId = stockItem.Id;
                                //        godown.Qty = -1 * item.Qty;
                                //        db.Execute("insert into godown(Id,TransType,Date,RefId,StockItemId,Qty) values(@Id,@TransType,@Date,@RefId,@StockItemId,@Qty)", godown, transaction: transaction);
                                //    }
                                //}

                                List<string> items = new List<string>();
                                if (discardBlood.BasedOn == "BagType")
                                {
                                    discardBlood.Id = db.ExecuteScalar<int>("select ifnull(Max(Id),0)+1 from DiscardBlood");
                                    discardBlood.BasedOn = "BagType";
                                    db.Execute("insert into DiscardBlood(ID,Reason,BloodGroupId,BagTypeId,Donorno,DiscardType,Date,BasedOn,BloodComponentId) values(@ID,@Reason,@BloodGroupId,@BagTypeId,@Donorno,@DiscardType,@Date,@BasedOn,@BloodComponentId)", discardBlood, transaction: transaction);
                                    string lstComponents = db.Query<string>("select components from BagType where id=" + discardBlood.BagTypeId).FirstOrDefault();
                                    items = lstComponents.Split(',').ToArray().ToList();
                                }
                                else
                                {
                                    discardBlood.Id = db.ExecuteScalar<int>("select ifnull(Max(Id),0)+1 from DiscardBlood");
                                    discardBlood.BasedOn = "Component";
                                    db.Execute("insert into DiscardBlood(ID,Reason,BloodGroupId,BagTypeId,Donorno,DiscardType,Date,BasedOn,BloodComponentId) values(@ID,@Reason,@BloodGroupId,@BagTypeId,@Donorno,@DiscardType,@Date,@BasedOn,@BloodComponentId)", discardBlood, transaction: transaction);
                                    items.Add(discardBlood.BloodComponentId.ToString());
                                }
                                foreach (var item in items)
                                {
                                    Stock stock = new Stock();
                                    stock.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from stock");
                                    stock.TransType = "DiscardStock";
                                    stock.Date = discardBlood.Date;
                                    stock.RefId = discardBlood.Id;
                                    stock.BloodGroupId = discardBlood.BloodGroupId;
                                    stock.BagTypeId = discardBlood.BagTypeId;
                                    stock.BloodComponentId = int.Parse(item);
                                    stock.Qty = -1;
                                    db.Execute("insert into stock(Id,TransType,Date,RefId,BloodGroupId,BloodComponentId,Qty,BagTypeId) values(@Id,@TransType,@Date,@RefId,@BloodGroupId,@BloodComponentId,@Qty,@BagTypeId)", stock, transaction: transaction);
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
        public ActionResult Put(int id, [FromBody] DiscardBlood discardBlood)
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
                                db.Execute("update DiscardBlood set Reason=@Reason,BloodGroupId=@BloodGroupId,BagTypeId=@BagTypeId,donorno=@donorno,DiscardType=@DiscardType,Date=@Date,BasedOn=@BasedOn,BloodComponentId=@BloodComponentId where Id =" + id, discardBlood);
                                //db.Execute("delete from godown where RefId=" + id + " and TransType = 'DiscardStock'", null, transaction: transaction);
                                db.Execute("delete from stock where RefId=" + id + " and TransType = 'DiscardStock'", null, transaction: transaction);


                                List<string> items = new List<string>();
                                if (discardBlood.BasedOn == "BagType")
                                {
                                    string lstComponents = db.Query<string>("select components from BagType where id=" + discardBlood.BagTypeId).FirstOrDefault();
                                    items = lstComponents.Split(',').ToArray().ToList();
                                }
                                else
                                {
                                    items.Add(discardBlood.BloodComponentId.ToString());
                                }
                                foreach (var item in items)
                                {
                                    Stock stock = new Stock();
                                    stock.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from stock");
                                    stock.TransType = "DiscardStock";
                                    stock.Date = discardBlood.Date;
                                    stock.RefId = id;
                                    stock.BloodGroupId = discardBlood.BloodGroupId;
                                    stock.BloodComponentId = int.Parse(item);
                                    stock.BagTypeId = discardBlood.BagTypeId;
                                    stock.Qty = -1;
                                    db.Execute("insert into stock(Id,TransType,Date,RefId,BloodGroupId,BloodComponentId,Qty,BagTypeId) values(@Id,@TransType,@Date,@RefId,@BloodGroupId,@BloodComponentId,@Qty,@BagTypeId)", stock, transaction: transaction);
                                }
                                transaction.Commit();
                                return Ok(discardBlood);
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
        public ActionResult<List<DiscardBlood>> Delete(int id)
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
                                db.Execute("delete from DiscardBlood where Id =" + id);
                                db.Execute("delete from godown where RefId=" + id + " and TransType = 'DiscardStock'", null, transaction: transaction);
                                db.Execute("delete from stock where RefId=" + id + " and TransType = 'DiscardStock'", null, transaction: transaction);
                                transaction.Commit();
                            }

                            List<DiscardBlood> obj = db.Query<DiscardBlood>("select DiscardBlood.*,BloodGroup.Name BloodGroupName,BagType.Name BagTypeName from DiscardBlood " +
                            "left join BloodGroup on DiscardBlood.BloodGroupId = BloodGroup.Id " +
                            "left join BagType on DiscardBlood.BagTypeId = BagType.Id").ToList();
                            return Ok(obj);
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
