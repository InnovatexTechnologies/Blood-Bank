using BloodBank.Models;
using Dapper;
using Microsoft.AspNetCore.Cors;
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
    public class LoginController : ControllerBase
    {
        private IConfiguration Configuration;
        private readonly ILogger<LoginController> logger;

        public LoginController(ILogger<LoginController> _logger, IConfiguration _Configuration)
        {
            _logger = logger;
            Configuration = _Configuration;
        }
        
        [HttpGet]

        public ActionResult<User> Get()
        {
            try
            {
                string ConnString = this.Configuration.GetConnectionString("MyConn");
                using (SQLiteConnection db = new SQLiteConnection(ConnString))
                {
                    string username = Request.Headers["Username"].FirstOrDefault();
                    string password = Request.Headers["Password"].FirstOrDefault();
                    User loginUser = db.Query<User>("select * from Users where name=@user and Password=@pass ", new { user = username, pass = password }).FirstOrDefault();
                    if (loginUser != null)
                    {
                        string Authorization = Convert.ToBase64String(Encoding.UTF8.GetBytes(username + ":" + password));
                        //loginUser.Authorization = Authorization;
                        return Ok(new { Authorization= Authorization });
                    }
                }
                return NotFound();

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

    }
}

