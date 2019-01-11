using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebAppProj.Data;

namespace WebAppProj.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        [HttpPost("[action]")]
        public string UserLogin([FromBody]UserLoginDetails userLoginDetails)
        {
            if (userLoginDetails.Username != "")
            {
                Console.WriteLine(userLoginDetails.Username);
            }

            if (userLoginDetails.Password != "")
            {
                Console.WriteLine(userLoginDetails.Password);
            }

            return "joetestreturn";
        }

        [HttpPost("[action]")]
        public async Task<string> UserLogout()
        {
            return "";
        }

        [HttpPost("[action]")]
        public async Task<string> UserRegister()
        {
            return "";
        }
    }
}
