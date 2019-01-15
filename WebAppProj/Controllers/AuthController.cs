using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using WebAppProj.Data;

//https://medium.com/@alexandarzaharyan/jwt-authentication-with-net-core-2-1-and-react-f12a9725c3bc
//https://www.meziantou.net/2018/04/30/jwt-authentication-with-asp-net-core

namespace WebAppProj.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        //Initialise configuration, gives access to appsettings.json.
        public AuthController(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        /*[HttpPost("[action]")]
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
        }*/

        [AllowAnonymous]
        [HttpPost("[action]")]
        public IActionResult UserLogin([FromBody] UserLoginDetails userLoginDetails)
        {
            if ((userLoginDetails.Username == "jim" && userLoginDetails.Password == "jim") || (userLoginDetails.Username == "john" && userLoginDetails.Password == "john")) //Check the database
            {
                //Get secret key from appsettings.json.
                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:SecretKey"]));

                //Generate credentials using secret key.
                var credentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

                //Create claims.
                var claims = new[]
                {
                    new Claim(ClaimTypes.Name, userLoginDetails.Username),
                    new Claim(ClaimTypes.Role, "Trainer"),//Get from database
                };

                //Create JWT.
                var jsonWebToken = new JwtSecurityToken(
                    issuer: Configuration["JWT:ValidIssuer"],
                    audience: Configuration["JWT:ValidAudience"],
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(60),
                    signingCredentials: credentials);

                var jsonWebTokenString = new JwtSecurityTokenHandler().WriteToken(jsonWebToken);
                var role = "";

                //Set user role
                if (userLoginDetails.Username == "jim")
                {
                    role = "Trainer";
                } else
                {
                    role = "Trainee";
                }

                //Create user
                var user = new UserDetails
                {
                    UserID = "User id",
                    Username = "User name",
                    UserRole = role,
                    Firstname = "jimmy",
                    Surname = "jommy",
                    JWT = jsonWebTokenString
                };

                //Return OK result with user
                return Ok(new
                {
                    user
                });
            }

            //Return bad request.
            return BadRequest("Login credentials invalid");
        }

        /*[HttpPost("[action]")]
        public async Task<string> UserLogout()
        {
            return "";
        }

        [HttpPost("[action]")]
        public async Task<string> UserRegister()
        {
            return "";
        }*/
    }
}
