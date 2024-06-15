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


namespace BloodBank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")]
    public class DonorController : ControllerBase
    {
        private IConfiguration Configuration;
        private readonly ILogger<DonorController> logger;

        public DonorController(ILogger<DonorController> _logger, IConfiguration _Configuration)
        {
            logger = _logger;
            Configuration = _Configuration;
        }
        [HttpGet]
        public ActionResult<List<Donar>> Get(string BagTypeId, string BloodGroupId, string DonorNo, int fromDate, int toDate, string DonationType = "", string DonorType = "", string Gender = "", string campType = "", string organisation = "")
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

                            if (!string.IsNullOrWhiteSpace(DonationType))
                            {
                                strWhere += " and DonationTypeId=" + DonationType;
                            }
                            if (!string.IsNullOrWhiteSpace(DonorType))
                            {
                                strWhere += " and DonorTypeId=" + DonorType;
                            }
                            if (!string.IsNullOrWhiteSpace(Gender))
                            {
                                strWhere += " and Gender=" + "'" + Gender + "'";
                            }
                            if (!string.IsNullOrWhiteSpace(campType))
                            {
                                strWhere += " and CampTypeId=" + campType;
                            }
                            if (!string.IsNullOrWhiteSpace(organisation))
                            {
                                strWhere += " and OrganizationId=" + organisation;
                            }
                            if (!string.IsNullOrWhiteSpace(BloodGroupId))
                            {
                                strWhere += " and donor.BloodGroupId=" + BloodGroupId;
                            }
                            if (!string.IsNullOrWhiteSpace(BagTypeId))
                            {
                                strWhere += " and donor.BagTypeId=" + BagTypeId;
                            }
                            if (!string.IsNullOrWhiteSpace(DonorNo))
                            {
                                strWhere += " and donor.DonorNo=" + DonorNo;
                            }

                            //List<Donar> donars = db.Query<Donar>("select donor.*,BloodGroup.Name BloodGroupName,BagType.Name BagTypeName,DonationType.Name DonationTypeName,CampType.Name CampTypeName,Organization.Name OrganizationName,DonorType.Name DonorTypeName from donor " +
                            //    "left join BloodGroup on donor.BloodGroupId = BloodGroup.Id " +
                            //    "left join BagType on donor.BagTypeId = BagType.Id " +
                            //    "left join DonationType on donor.DonationTypeId = DonationType.Id " +
                            //    "left join CampType on donor.CampTypeId = CampType.Id " +
                            //    "left join Organization on donor.OrganizationId = Organization.Id " +
                            //    "left join DonorType on donor.DonorTypeId = DonorType.Id " +
                            //    "where DOD>=" + fromDate + " and DOD<=" + toDate + strWhere + " order by DonorNo").ToList();

                            //List<Donar> donars = db.Query<Donar>("SELECT DISTINCT donor.*," +
                            //    " BloodGroup.Name AS BloodGroupName, BagType.Name AS BagTypeName," +
                            //    " DonationType.Name AS DonationTypeName, CampType.Name AS CampTypeName," +
                            //    " Organization.Name AS OrganizationName, DonorType.Name AS DonorTypeName," +
                            //    " (SELECT SupplyNo FROM Issue WHERE Donor.DonorNo = Issue.DonorNo AND Issue.BloodComponentId LIKE '%1%') AS Plasma," +
                            //    " (SELECT SupplyNo FROM Issue WHERE Donor.DonorNo = Issue.DonorNo AND Issue.BloodComponentId LIKE '%2%') AS RBC," +
                            //    " (SELECT SupplyNo FROM Issue WHERE Donor.DonorNo = Issue.DonorNo AND Issue.BloodComponentId LIKE '%3%') AS Platelets," +
                            //    " (SELECT SupplyNo FROM Issue WHERE Donor.DonorNo = Issue.DonorNo AND Issue.BloodComponentId LIKE '%4%') AS WholeBlood FROM donor" +
                            //    " LEFT JOIN  BloodGroup ON donor.BloodGroupId = BloodGroup.Id" +
                            //    " LEFT JOIN BagType ON donor.BagTypeId = BagType.Id" +
                            //    " LEFT JOIN DonationType ON donor.DonationTypeId = DonationType.Id" +
                            //    " LEFT JOIN CampType ON donor.CampTypeId = CampType.Id" +
                            //    " LEFT JOIN Organization ON donor.OrganizationId = Organization.Id" +
                            //    " LEFT JOIN DonorType ON donor.DonorTypeId = DonorType.Id" +
                            //    " LEFT JOIN Issue ON donor.DonorNo = Issue.DonorNo" +
                            //    " WHERE DOD>=" + fromDate + " and DOD<=" + toDate + strWhere +
                            //    " GROUP BY donor.Id ORDER BY donor.DonorNo;").ToList();

                            List<Donar> donars = db.Query<Donar>("SELECT DISTINCT donor.*," +
                               " BloodGroup.Name AS BloodGroupName, BagType.Name AS BagTypeName," +
                               " DonationType.Name AS DonationTypeName, CampType.Name AS CampTypeName," +
                               " Organization.Name AS OrganizationName, DonorType.Name AS DonorTypeName," +
                               " (SELECT SupplyNo FROM Issue WHERE Donor.DonorNo = Issue.DonorNo AND Issue.BloodComponentId LIKE '%1%') AS Plasma," +
                               " (SELECT SupplyNo FROM Issue WHERE Donor.DonorNo = Issue.DonorNo AND Issue.BloodComponentId LIKE '%2%') AS RBC," +
                               " (SELECT SupplyNo FROM Issue WHERE Donor.DonorNo = Issue.DonorNo AND Issue.BloodComponentId LIKE '%3%') AS Platelets," +
                               " (SELECT SupplyNo FROM Issue WHERE Donor.DonorNo = Issue.DonorNo AND Issue.BloodComponentId LIKE '%4%') AS WholeBlood, " +
                               " (SELECT Reason FROM DiscardBlood WHERE Donor.DonorNo = DiscardBlood.DonorNo) AS DiscardReactive, " +
                               " (SELECT BasedOn FROM DiscardBlood WHERE Donor.DonorNo = DiscardBlood.DonorNo) AS BasedOn, " +
                               " (SELECT (SELECT Name from BloodComponents where DiscardBlood.BloodComponentId=BloodComponents.Id) FROM DiscardBlood WHERE Donor.DonorNo = DiscardBlood.DonorNo) AS Component " +
                               " FROM donor" +
                               " LEFT JOIN  BloodGroup ON donor.BloodGroupId = BloodGroup.Id" +
                               " LEFT JOIN BagType ON donor.BagTypeId = BagType.Id" +
                               " LEFT JOIN DonationType ON donor.DonationTypeId = DonationType.Id" +
                               " LEFT JOIN CampType ON donor.CampTypeId = CampType.Id" +
                               " LEFT JOIN Organization ON donor.OrganizationId = Organization.Id" +
                               " LEFT JOIN DonorType ON donor.DonorTypeId = DonorType.Id" +
                               " LEFT JOIN Issue ON donor.DonorNo = Issue.DonorNo" +
                               " WHERE DOD>=" + fromDate + " and DOD<=" + toDate + strWhere +
                               " GROUP BY donor.Id ORDER BY donor.DonorNo;").ToList();
                            return Ok(donars);
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
        public ActionResult<Donar> Get(int id)
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
                            Donar donar = db.Query<Donar>("select donor.*,BloodGroup.Name BloodGroupName,BagType.Name BagTypeName,DonationType.Name DonationTypeName,CampType.Name CampTypeName,Organization.Name OrganizationName,DonorType.Name DonorTypeName from donor " +
                                "left join BloodGroup on donor.BloodGroupId = BloodGroup.Id " +
                                "left join BagType on donor.BagTypeId = BagType.Id " +
                                "left join DonationType on donor.DonationTypeId = DonationType.Id " +
                                "left join CampType on donor.CampTypeId = CampType.Id " +
                                "left join Organization on donor.OrganizationId = Organization.Id " +
                                "left join DonorType on donor.DonorTypeId = DonorType.Id where donor.id=" + id).FirstOrDefault();
                            return Ok(donar);
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
        public ActionResult<Donar> Post(Donar donar)
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
                            int dateToCompare = db.ExecuteScalar<int>("select ifnull(max(DOD),strftime('%Y%m%d', 'now')) from donor");
                            if (donar.DOD != 0 && (!string.IsNullOrEmpty(donar.Name)) && donar.DonorTypeId != 0 && !string.IsNullOrEmpty(donar.Mobile) && donar.BloodGroupId != 0 && donar.DonationTypeId != 0 && donar.BagTypeId != 0 && !string.IsNullOrEmpty(donar.Gender))
                            {
                                if (donar.DOD >= dateToCompare)
                                {
                                    using (var transaction = db.BeginTransaction())
                                    {
                                        donar.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from donor");
                                        donar.DonorNo = db.ExecuteScalar<string>("select ifnull(max(DonorNo),0)+1 from donor");
                                        //donar.Gender = "Male";
                                        donar.UseStatus = 0;
                                        db.Execute("insert into donor(Id,DOD,BloodGroupId,BagTypeId,Name,Mobile,DonorNo,DonationTypeId,OrganizationId,CampTypeId,DonorTypeId,Gender,Age,Address,UseStatus) values(@Id,@DOD,@BloodGroupId,@BagTypeId,@Name,@Mobile,@DonorNo,@DonationTypeId,@OrganizationId,@CampTypeId,@DonorTypeId,@Gender,@Age,@Address,@UseStatus)", donar, transaction: transaction);

                                        List<BagTypeConsumption> bagTypeConsumptions = db.Query<BagTypeConsumption>("select * from BagTypeConsumption where BagTypeId=" + donar.BagTypeId).ToList();
                                        foreach (var item in bagTypeConsumptions)
                                        {
                                            if (item.Qty > 0)
                                            {
                                                StockItem stockItem = db.Query<StockItem>("select id from StockItem where id=" + item.StockItemId).FirstOrDefault();
                                                Godown godown = new Godown();
                                                godown.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from godown");
                                                godown.TransType = "Donation";
                                                godown.Date = donar.DOD;
                                                godown.RefId = donar.Id;
                                                godown.StockItemId = stockItem.Id;
                                                godown.Qty = -1 * item.Qty;
                                                db.Execute("insert into godown(Id,TransType,Date,RefId,StockItemId,Qty) values(@Id,@TransType,@Date,@RefId,@StockItemId,@Qty)", godown, transaction: transaction);
                                            }
                                        }

                                        string lstComponents = db.Query<string>("select components from BagType where id=" + donar.BagTypeId).FirstOrDefault();
                                        string[] items = lstComponents.Split(',').ToArray();
                                        foreach (var item in items)
                                        {
                                            Stock stock = new Stock();
                                            stock.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from stock");
                                            stock.TransType = "Donation";
                                            stock.Date = donar.DOD;
                                            stock.RefId = donar.Id;
                                            stock.DonorNumber = donar.DonorNo;
                                            stock.BloodGroupId = donar.BloodGroupId;
                                            stock.BloodComponentId = int.Parse(item);
                                            stock.Qty = 1;
                                            db.Execute("insert into stock(Id,TransType,Date,RefId,DonorNumber,BloodGroupId,BloodComponentId,Qty,BagTypeId) values(@Id,@TransType,@Date,@RefId,@DonorNumber,@BloodGroupId,@BloodComponentId,@Qty,@BagTypeId)", stock, transaction: transaction);
                                        }
                                        transaction.Commit();
                                    }
                                }
                                else
                                {
                                    return StatusCode(StatusCodes.Status401Unauthorized, new { success = false, message = "Entry can't be done on this date." });
                                }
                            }
                            else
                            {
                                if (donar.DOD == 0)
                                {
                                    return StatusCode(StatusCodes.Status401Unauthorized, new { success = false, message = "Date can't be blank." });
                                }
                                if (string.IsNullOrEmpty(donar.Name))
                                {
                                    return StatusCode(StatusCodes.Status401Unauthorized, new { success = false, message = "Name can't be blank." });
                                }
                                if (donar.DonorTypeId == 0)
                                {
                                    return StatusCode(StatusCodes.Status401Unauthorized, new { success = false, message = "Donor Type can't be blank." });
                                }
                                if (string.IsNullOrEmpty(donar.Mobile))
                                {
                                    return StatusCode(StatusCodes.Status401Unauthorized, new { success = false, message = "Mobile can't be blank." });
                                }
                                if (donar.BloodGroupId == 0)
                                {
                                    return StatusCode(StatusCodes.Status401Unauthorized, new { success = false, message = "BloodGroup can't be blank." });
                                }
                                if (donar.DonationTypeId == 0)
                                {
                                    return StatusCode(StatusCodes.Status401Unauthorized, new { success = false, message = "DonationType can't be blank." });
                                }
                                if (donar.BagTypeId == 0)
                                {
                                    return StatusCode(StatusCodes.Status401Unauthorized, new { success = false, message = "BagType can't be blank." });
                                }
                                if (string.IsNullOrEmpty(donar.Gender))
                                {
                                    return StatusCode(StatusCodes.Status401Unauthorized, new { success = false, message = "Gender can't be blank." });
                                }
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
        public ActionResult<Donar> Put(int id, [FromBody] Donar donar)
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
                            //int dateToCompare = db.ExecuteScalar<int>("select ifnull(max(DOD),strftime('%Y%m%d', 'now')) from donor");
                            //if (donar.DOD != 0 && (!string.IsNullOrEmpty(donar.Name)) && donar.DonorTypeId != 0 && !string.IsNullOrEmpty(donar.Mobile) && donar.BloodGroupId != 0 && donar.DonationTypeId != 0 && donar.BagTypeId != 0 && !string.IsNullOrEmpty(donar.Gender))
                            //{
                            //    if (donar.DOD >= dateToCompare)
                            //    {

                            using (var transaction = db.BeginTransaction())
                            {
                                db.Execute("update Donor set DOD=@DOD,BloodGroupId=@BloodGroupId,BagTypeId=@BagTypeId,Name=@Name,Mobile=@Mobile,DonationTypeId=@DonationTypeId,OrganizationId=@OrganizationId,CampTypeId=@CampTypeId,DonorTypeId=@DonorTypeId,Gender=@Gender,Age=@Age,Address=@Address where Id=" + id, donar, transaction: transaction);

                                db.Execute("delete from godown where RefId=" + id + " and TransType = 'Donation'", null, transaction: transaction);

                                List<BagTypeConsumption> bagTypeConsumptions = db.Query<BagTypeConsumption>("select * from BagTypeConsumption where BagTypeId=" + donar.BagTypeId).ToList();
                                foreach (var item in bagTypeConsumptions)
                                {
                                    if (item.Qty > 0)
                                    {
                                        StockItem stockItem = db.Query<StockItem>("select id from StockItem where id=" + item.StockItemId).FirstOrDefault();
                                        Godown godown = new Godown();
                                        godown.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from godown");
                                        godown.TransType = "Donation";
                                        godown.Date = donar.DOD;
                                        godown.RefId = id;
                                        godown.StockItemId = stockItem.Id;
                                        godown.Qty = -1 * item.Qty;
                                        db.Execute("insert into godown(Id,TransType,Date,RefId,StockItemId,Qty) values(@Id,@TransType,@Date,@RefId,@StockItemId,@Qty)", godown, transaction: transaction);
                                    }
                                }

                                db.Execute("delete from stock where RefId=" + id + " and TransType = 'Donation'", null, transaction: transaction);

                                string lstComponents = db.Query<string>("select components from BagType where id=" + donar.BagTypeId).FirstOrDefault();
                                string[] items = lstComponents.Split(',').ToArray();
                                foreach (var item in items)
                                {
                                    Stock stock = new Stock();
                                    stock.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from stock");
                                    stock.TransType = "Donation";
                                    stock.Date = donar.DOD;
                                    stock.RefId = id;
                                    stock.DonorNumber = donar.DonorNo;
                                    stock.BloodGroupId = donar.BloodGroupId;
                                    stock.BloodComponentId = int.Parse(item);
                                    stock.Qty = 1;
                                    db.Execute("insert into stock(Id,TransType,Date,RefId,DonorNumber,BloodGroupId,BloodComponentId,Qty,BagTypeId) values(@Id,@TransType,@Date,@RefId,@DonorNumber,@BloodGroupId,@BloodComponentId,@Qty,@BagTypeId)", stock, transaction: transaction);
                                }
                                transaction.Commit();
                                return Ok(donar);
                            }
                            //            }
                            //            else
                            //            {
                            //                return StatusCode(StatusCodes.Status401Unauthorized, new { success = false, message = "Entry can't be done on this date." });
                            //            }
                            //        }
                            //        else
                            //        {
                            //            if (donar.DOD == 0)
                            //            {
                            //                return StatusCode(StatusCodes.Status401Unauthorized, new { success = false, message = "Date can't be blank." });
                            //            }
                            //            if (string.IsNullOrEmpty(donar.Name))
                            //            {
                            //                return StatusCode(StatusCodes.Status401Unauthorized, new { success = false, message = "Name can't be blank." });
                            //            }
                            //            if (donar.DonorTypeId == 0)
                            //            {
                            //                return StatusCode(StatusCodes.Status401Unauthorized, new { success = false, message = "Donor Type can't be blank." });
                            //            }
                            //            if (string.IsNullOrEmpty(donar.Mobile))
                            //            {
                            //                return StatusCode(StatusCodes.Status401Unauthorized, new { success = false, message = "Mobile can't be blank." });
                            //            }
                            //            if (donar.BloodGroupId == 0)
                            //            {
                            //                return StatusCode(StatusCodes.Status401Unauthorized, new { success = false, message = "BloodGroup can't be blank." });
                            //            }
                            //            if (donar.DonationTypeId == 0)
                            //            {
                            //                return StatusCode(StatusCodes.Status401Unauthorized, new { success = false, message = "DonationType can't be blank." });
                            //            }
                            //            if (donar.BagTypeId == 0)
                            //            {
                            //                return StatusCode(StatusCodes.Status401Unauthorized, new { success = false, message = "BagType can't be blank." });
                            //            }
                            //            if (string.IsNullOrEmpty(donar.Gender))
                            //            {
                            //                return StatusCode(StatusCodes.Status401Unauthorized, new { success = false, message = "Gender can't be blank." });
                            //            }
                            //        }
                        }
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
            return Ok(new { success = true, message = "Data Updated." });
        }

        [HttpDelete("{id}")]
        public ActionResult<List<Donar>> Delete(int id)
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
                                db.Execute("delete from Donor where Id =" + id);
                                db.Execute("delete from stock where RefId=" + id + " and TransType = 'Donation'", null, transaction: transaction);
                                db.Execute("delete from godown where RefId=" + id + " and TransType = 'Donation'", null, transaction: transaction);
                                transaction.Commit();
                            }

                            List<Donar> donars = db.Query<Donar>("select donor.*,BloodGroup.Name BloodGroupName,BagType.Name BagTypeName,DonationType.Name DonationTypeName,CampType.Name CampTypeName,Organization.Name OrganizationName,DonorType.Name DonorTypeName from donor " +
                                "left join BloodGroup on donor.BloodGroupId = BloodGroup.Id " +
                                "left join BagType on donor.BagTypeId = BagType.Id " +
                                "left join DonationType on donor.DonationTypeId = DonationType.Id " +
                                "left join CampType on donor.CampTypeId = CampType.Id " +
                                "left join Organization on donor.OrganizationId = Organization.Id " +
                                "left join DonorType on donor.DonorTypeId = DonorType.Id").ToList();
                            return Ok(donars);
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
