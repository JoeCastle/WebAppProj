using System;
using System.Collections.Generic;
using System.Data.SqlClient;
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

                var role = "";

                //Set user role
                if (userLoginDetails.Username == "jim")
                {
                    role = "Trainer";
                }
                else
                {
                    role = "Trainee";
                }

                //Create claims.
                var claims = new[]
                {
                    new Claim("UserID", "User id"),//Get from database
                    new Claim("Username", userLoginDetails.Username),
                    new Claim(ClaimTypes.Role, role),//Get from database
                    new Claim("Firstname", "jimmy"),//Get from database
                    new Claim("Surname", "jommy"),//Get from database
                };

                //Create JWT.
                var jsonWebToken = new JwtSecurityToken(
                    issuer: Configuration["JWT:ValidIssuer"],
                    audience: Configuration["JWT:ValidAudience"],
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(60),
                    signingCredentials: credentials);

                var jsonWebTokenString = new JwtSecurityTokenHandler().WriteToken(jsonWebToken);
                
                //Create user
                var user = new UserDetails
                {
                    UserID = "User id",
                    Username = userLoginDetails.Username,
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

        //https://www.google.com/search?rlz=1C1CHBF_en-GBGB755GB755&ei=JtVDXNvyJJOF1fAPp5KVuA8&q=asp.net+core+2.0+hash+and+salt+password&oq=asp.net+core+2.0+hash+and+salt+password&gs_l=psy-ab.3...3460.4283..4443...0.0..0.46.172.4......0....1..gws-wiz.......0i71j33i21.HdLxHPMTG9I
        //https://stackoverflow.com/questions/1054022/best-way-to-store-password-in-database
        //https://stackoverflow.com/questions/53578182/best-way-to-store-user-password-on-net-core-mvc-application
        //https://tahirnaushad.com/2017/09/09/hashing-in-asp-net-core-2-0/
        //https://andrewlock.net/exploring-the-asp-net-core-identity-passwordhasher/
        //https://stackoverflow.com/questions/4181198/how-to-hash-a-password/10402129#10402129
        //https://github.com/defuse/password-hashing/blob/master/PasswordStorage.cs
        //https://github.com/defuse/password-hashing
        //https://medium.com/@mehanix/lets-talk-security-salted-password-hashing-in-c-5460be5c3aae
        //asp.net core identity password hasher
        //keyderivation.pbkdf2

        //https://stackoverflow.com/questions/8218867/c-sharp-sql-insert-command
        //https://www.youtube.com/watch?v=18Q4pGzL_U8
        //https://docs.microsoft.com/en-us/ef/core/get-started/aspnetcore/existing-db
        //https://docs.microsoft.com/en-us/aspnet/core/tutorials/razor-pages/sql?view=aspnetcore-2.2&tabs=visual-studio
        //https://www.youtube.com/watch?v=_Q6fKXJYXdk
        //https://www.youtube.com/watch?v=3MQE6Mj9u6U
        //https://ef.readthedocs.io/en/staging/platforms/aspnetcore/existing-db.html
        //https://codereview.stackexchange.com/questions/3170/inserting-records-into-a-database
        //https://stackoverflow.com/questions/8218867/c-sharp-sql-insert-command
        //https://stackoverflow.com/questions/19956533/sql-insert-query-using-c-sharp/19956944
        //https://social.msdn.microsoft.com/Forums/vstudio/en-US/e5fa4f20-8293-4461-9fee-91867d4318ea/c-sql-insert-statement?forum=csharpgeneral
        //https://www.codeproject.com/Questions/459498/SQL-INSERT-statements-in-Csharp
        //
        [AllowAnonymous]
        [HttpPost("[action]")]
        public bool UserRegister([FromBody] UserRegisterDetails userRegisterDetails)
        {
            string connectionString = Configuration["ConnectionStrings:DefaultConnectionString"];
            string statement = "INSERT INTO dbo.SMS_PW (Username,Password,Firstname,Surname,Role, Subject) VALUES (@username,@password,@firstname,@surname,@role)";

            SqlConnection connection = new SqlConnection(connectionString);

            connection.Open();

            SqlCommand command = new SqlCommand(statement, connection);
            //command.Parameters.Add("", );
            //command.Parameters.Add("@username", "abc");
            //command.Parameters.Add("@password", "abc");

            connection.Close();

            int queryResult = command.ExecuteNonQuery();

            // Check Error
            if (queryResult < 0)
            {
                Console.WriteLine("Error inserting data into Database!");
            }

            connection.Close();

            if (userRegisterDetails.Username != "" && userRegisterDetails.Password != "") //Check the database
            {
                ////Get secret key from appsettings.json.
                //var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:SecretKey"]));

                ////Generate credentials using secret key.
                //var credentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

                ////Create claims.
                //var claims = new[]
                //{
                //    new Claim("UserID", "User id"),//Get from database
                //    new Claim("Username", userRegisterDetails.Username),
                //    new Claim(ClaimTypes.Role, userRegisterDetails.UserRole),//Get from database
                //    new Claim("Firstname", "jimmy"),//Get from database
                //    new Claim("Surname", "jommy"),//Get from database
                //};

                ////Create JWT.
                //var jsonWebToken = new JwtSecurityToken(
                //    issuer: Configuration["JWT:ValidIssuer"],
                //    audience: Configuration["JWT:ValidAudience"],
                //    claims: claims,
                //    expires: DateTime.Now.AddMinutes(60),
                //    signingCredentials: credentials);

                //var jsonWebTokenString = new JwtSecurityTokenHandler().WriteToken(jsonWebToken);

                ////Create user
                //var user = new UserDetails
                //{
                //    UserID = "User id",
                //    Username = userRegisterDetails.Username,
                //    UserRole = userRegisterDetails.UserRole,
                //    Firstname = "jimmy",
                //    Surname = "jommy",
                //    JWT = jsonWebTokenString
                //};

                ////Return OK result with user
                //return Ok(new
                //{
                //    user
                //});
                return true;
            }

            //Return bad request.
            //return BadRequest("Login credentials invalid");
            return false;
        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        public IActionResult VerifyJWT([FromBody] string jsonWebTokenString)//Mighy need different type.
        {
            //Get secret key from appsettings.json.
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:SecretKey"]));

            //Set token validation parameters.
            var tokenValidationParameters = new TokenValidationParameters
            {
                IssuerSigningKey = secretKey,
                ValidAudience = Configuration["JWT:ValidAudience"],
                ValidIssuer = Configuration["JWT:ValidIssuer"]
            };

            //Generate claims principal.
            SecurityToken securityToken;
            ClaimsPrincipal claimsPrincipal = new JwtSecurityTokenHandler().ValidateToken(jsonWebTokenString, tokenValidationParameters, out securityToken);

            if (claimsPrincipal == null)
            {
                return BadRequest("Invalid JWT");
            }

            //Generate claims identity.
            ClaimsIdentity identity = (ClaimsIdentity)claimsPrincipal.Identity;

            if (identity == null)
            {
                return BadRequest("Invalid JWT");
            }

            //Get claims from identity.
            Claim userIDClaim = identity.FindFirst("UserID");
            Claim usernameClaim = identity.FindFirst("Username");
            Claim roleClaim = identity.FindFirst(ClaimTypes.Role);
            Claim firstnameClaim = identity.FindFirst("Firstname");
            Claim surnameClaim = identity.FindFirst("Surname");

            //Create user
            var user = new UserDetails
            {
                UserID = userIDClaim.Value,
                Username = usernameClaim.Value,
                UserRole = roleClaim.Value,
                Firstname = firstnameClaim.Value,
                Surname = surnameClaim.Value,
                JWT = jsonWebTokenString
            };

            //Return OK result with user
            return Ok(new
            {
                user
            });
        }

        /*[HttpPost("[action]")]
        public async Task<string> UserRegister()
        {
            return "";
        }*/
    }
}
