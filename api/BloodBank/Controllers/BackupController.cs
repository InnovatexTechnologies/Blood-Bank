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
using System.IO;
using System.IO.Compression;
using Microsoft.AspNetCore.Hosting;

namespace BloodBank.Controllers
{
    public class BackupController : Controller
    {
        private IConfiguration Configuration;
        private readonly ILogger<BackupController> logger;
        private readonly IWebHostEnvironment Environment;

        public BackupController(ILogger<BackupController> _logger, IConfiguration _Configuration, IWebHostEnvironment _environment)
        {
            logger = _logger;
            Configuration = _Configuration;
            Environment = _environment;
        }
        [HttpGet]
        public IActionResult DownloadFile()
        {
            try
            {

            using (MemoryStream memoryStream = new MemoryStream())
            {
                string path = Path.Combine(Directory.GetCurrentDirectory(), "App_Data", "BloodBank.db");
                using (ZipArchive zip = new ZipArchive(memoryStream, ZipArchiveMode.Create, true))
                {
                    zip.CreateEntryFromFile(path, "BloodBank.db");
                }
                MemoryStream attachmentStream = new MemoryStream(memoryStream.ToArray());
                return File(memoryStream.ToArray(), "application/zip", "Backup.zip");
            }
            }
            catch (Exception ex)
            {
                return Content(ex.Message) ;
            }
        }
    }
}