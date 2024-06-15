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
    public class ResaveController : Controller
    {
        private IConfiguration Configuration;
        private readonly ILogger<ResaveController> logger;

        public ResaveController(ILogger<ResaveController> _logger, IConfiguration _Configuration)
        {
            logger = _logger;
            Configuration = _Configuration;
        }


        public IActionResult Donation()
        {
            string ConnString = this.Configuration.GetConnectionString("MyConn");
            using (SQLiteConnection db = new SQLiteConnection(ConnString))
            {

                List<Donar> donars = db.Query<Donar>("Select * from Donor").ToList();

                foreach (Donar donar in donars)
                {

                    db.Execute("update Donor set DOD=@DOD,BloodGroupId=@BloodGroupId,BagTypeId=@BagTypeId,Name=@Name,Mobile=@Mobile,DonationTypeId=@DonationTypeId,OrganizationId=@OrganizationId,CampTypeId=@CampTypeId,DonorTypeId=@DonorTypeId,Gender=@Gender,Age=@Age,Address=@Address where Id=" + donar.Id, donar);

                    db.Execute("delete from godown where RefId=" + donar.Id + " and TransType = 'Donation'", null);

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
                            db.Execute("insert into godown(Id,TransType,Date,RefId,StockItemId,Qty) values(@Id,@TransType,@Date,@RefId,@StockItemId,@Qty)", godown);
                        }
                    }

                    db.Execute("delete from stock where RefId=" + donar.Id + " and TransType = 'Donation'", null);

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
                        db.Execute("insert into stock(Id,TransType,Date,RefId,DonorNumber,BloodGroupId,BloodComponentId,Qty,BagTypeId) values(@Id,@TransType,@Date,@RefId,@DonorNumber,@BloodGroupId,@BloodComponentId,@Qty,@BagTypeId)", stock);
                    }



                }
                return Content("Done");
            }
        }

        public IActionResult BloodIssue()
        {
            string ConnString = this.Configuration.GetConnectionString("MyConn");
            using (SQLiteConnection db = new SQLiteConnection(ConnString))
            {


                List<Issue> issues = db.Query<Issue>("Select * from Issue").ToList();

                foreach (Issue issue in issues)
                {
                    db.Execute("update Issue set DOI=@DOI,PatientName=@PatientName,HospitalId=@HospitalId,DonorNo=@DonorNo,BloodGroupId=@BloodGroupId,Free_Paid=@Free_Paid,Amount=@Amount,ReceiptNo=@ReceiptNo,BloodComponentId=@BloodComponentId,Institution_Doctor=@Institution_Doctor,PatientTypeId=@PatientTypeId,AgainstDonor=@AgainstDonor,Remark=@Remark where Id =" + issue.Id, issue);

                    db.Execute("delete from stock where RefId=" + issue.Id + " and TransType = 'Issue'", null);

                    Stock stock = new Stock();
                    stock.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from stock");
                    stock.TransType = "Issue";
                    stock.Date = issue.DOI;
                    stock.RefId = issue.Id;
                    stock.BloodGroupId = issue.BloodGroupId;
                    stock.BloodComponentId = issue.BloodComponentId;
                    stock.DonorNumber = issue.DonorNo;
                    stock.Qty = -1;
                    db.Execute("insert into stock(Id,TransType,Date,RefId,BloodGroupId,BloodComponentId,DonorNumber,Qty) values(@Id,@TransType,@Date,@RefId,@BloodGroupId,@BloodComponentId,@DonorNumber,@Qty)", stock);

                }
                return Content("Done");
            }
        }

        public IActionResult StockPurchase()
        {
            string ConnString = this.Configuration.GetConnectionString("MyConn");
            using (SQLiteConnection db = new SQLiteConnection(ConnString))
            {


                List<StockPurchase> stockPurchases = db.Query<StockPurchase>("Select * from StockPurchase").ToList();

                foreach (StockPurchase stockPurchase in stockPurchases)
                {
                    db.Execute("update StockPurchase set Date=@Date,StockItemId=@StockItemId,Qty=@Qty,Remark=@Remark where Id=" + stockPurchase.Id, stockPurchase);

                    db.Execute("delete from godown where RefId=" + stockPurchase.Id + " and TransType = 'StockPurchase'", null);

                    Godown godown = new Godown();
                    godown.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from godown");
                    godown.TransType = "StockPurchase";
                    godown.Date = stockPurchase.Date;
                    godown.RefId = stockPurchase.Id;
                    godown.StockItemId = stockPurchase.StockItemId;
                    godown.Qty = stockPurchase.Qty;
                    db.Execute("insert into godown(Id,TransType,Date,RefId,StockItemId,Qty) values(@Id,@TransType,@Date,@RefId,@StockItemId,@Qty)", godown);

                }
                return Content("Done");
            }
        }

        public IActionResult DiscardReactive()
        {
            string ConnString = this.Configuration.GetConnectionString("MyConn");
            using (SQLiteConnection db = new SQLiteConnection(ConnString))
            {


                List<DiscardBlood> discardBloods = db.Query<DiscardBlood>("Select * from DiscardBlood").ToList();

                foreach (DiscardBlood discardBlood in discardBloods)
                {
                    db.Execute("update DiscardBlood set Reason=@Reason,BloodGroupId=@BloodGroupId,BagTypeId=@BagTypeId,donorno=@donorno,DiscardType=@DiscardType,Date=@Date where Id =" + discardBlood.Id, discardBlood);
                    db.Execute("delete from godown where RefId=" + discardBlood.Id + " and TransType = 'DiscardStock'", null);
                    db.Execute("delete from stock where RefId=" + discardBlood.Id + " and TransType = 'DiscardStock'", null);

                    string lstComponents = db.Query<string>("select components from BagType where id=" + discardBlood.BagTypeId).FirstOrDefault();
                    string[] items = lstComponents.Split(',').ToArray();
                    foreach (var item in items)
                    {
                        Stock stock = new Stock();
                        stock.Id = db.ExecuteScalar<int>("select ifnull(max(Id),0)+1 from stock");
                        stock.TransType = "DiscardStock";
                        stock.Date = discardBlood.Date;
                        stock.RefId = discardBlood.Id;
                        stock.BloodGroupId = discardBlood.BloodGroupId;
                        stock.BloodComponentId = int.Parse(item);
                        stock.Qty = -1;
                        db.Execute("insert into stock(Id,TransType,Date,RefId,BloodGroupId,BloodComponentId,Qty,BagTypeId) values(@Id,@TransType,@Date,@RefId,@BloodGroupId,@BloodComponentId,@Qty,@BagTypeId)", stock);
                    }

                }
                return Content("Done");
            }
        }
    }
}
