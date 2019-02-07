using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
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

        /// <summary>
        /// Logs an existing user into the system.
        /// </summary>
        /// <param name="userLoginDetails"></param>
        /// <returns>Returns the user object and action result.</returns>
        [AllowAnonymous]
        [HttpPost("[action]")]
        public IActionResult UserLogin([FromBody] UserLoginDetails userLoginDetails)
        {
            //int queryResult = -1; //Set query result to fail.
            string connectionString = Configuration["ConnectionStrings:DefaultConnectionString"];

            string password = "";

            //Create user
            var user = new CurrentUserDetails();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                //Create the SQL command and set type to stored procedure.
                SqlCommand command = new SqlCommand("User_Login", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Set the parameters for the command.
                command.Parameters.AddWithValue("@username", userLoginDetails.Username);

                connection.Open();

                //Execute the query and store the result
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            user.UserID = reader.GetInt32(reader.GetOrdinal("UserID"));
                            user.Username = reader.GetString(reader.GetOrdinal("Username"));
                            password = reader.GetString(reader.GetOrdinal("Password"));
                            user.UserRole = reader.GetString(reader.GetOrdinal("Role"));
                            user.Firstname = reader.GetString(reader.GetOrdinal("Firstname"));
                            user.Surname = reader.GetString(reader.GetOrdinal("Surname"));
                            user.GroupID = reader.GetInt32(reader.GetOrdinal("GroupID"));
                        }
                        reader.Close();
                    }
                    else
                    {
                        return BadRequest("Login credentials invalid");
                    }
                }

                connection.Close();
            }

            bool passwordsMatch = VerifyPasswordHashAndSalt(userLoginDetails.Password, password);

            // Check Error
            if (!passwordsMatch)
            {
                //FAIL
                //Return bad request.
                return BadRequest("Login credentials invalid");
            }

            //Get user JWT
            user.JWT = CreateJWT(user.UserID, user.Username, user.UserRole); ;

            //Return OK result with user
            return Ok(new
            {
                user
            });
        }

        /// <summary>
        /// Registers a new user.
        /// </summary>
        /// <param name="userRegisterDetails"></param>
        /// <returns>Returns true if the user has been registered.</returns>
        [AllowAnonymous]
        [HttpPost("[action]")]
        public bool UserRegister([FromBody] UserRegisterDetails userRegisterDetails)
        {
            int queryResult = -1; //Set query result to fail.
            string connectionString = Configuration["ConnectionStrings:DefaultConnectionString"];

            //Hash the password.
            string hashedAndSaltedPassword = GetPasswordHashAndSalt(userRegisterDetails.Password);

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                var username = userRegisterDetails.Username;
                var password = hashedAndSaltedPassword;
                var role = userRegisterDetails.UserRole;
                var firstname = userRegisterDetails.Firstname;
                var surname = userRegisterDetails.Surname;
                int groupid = 1; //Have default "unassigned" group in the table

                //Create the SQL command and set type to stored procedure.
                SqlCommand command = new SqlCommand("User_Register", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Set the parameters for the command.
                command.Parameters.AddWithValue("@username", username);
                command.Parameters.AddWithValue("@password", password);
                command.Parameters.AddWithValue("@role", role);
                command.Parameters.AddWithValue("@firstname", firstname);
                command.Parameters.AddWithValue("@surname", surname);
                command.Parameters.AddWithValue("@groupid", groupid);

                connection.Open();

                //Execute the query and store the result
                queryResult = command.ExecuteNonQuery();

                connection.Close();
            }

            // Check Error
            if (queryResult == 1)
            {
                //SUCCESS
                return true;
            }
            else
            {
                //FAIL
                return false;
            }
        }

        /// <summary>
        /// Verifys the json web token.
        /// </summary>
        /// <param name="jsonWebTokenString">The users json web token.</param>
        /// <returns>Returns ok if the token is valid.</returns>
        [AllowAnonymous]
        [HttpPost("[action]")]
        public IActionResult VerifyJWT([FromBody] string jsonWebTokenString)//Might need different type.
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

            int userID = Int32.Parse(identity.FindFirst("UserID").Value);

            string connectionString = Configuration["ConnectionStrings:DefaultConnectionString"];

            //Create user
            var user = new CurrentUserDetails();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                //Create the SQL command and set type to stored procedure.
                SqlCommand command = new SqlCommand("User_GetByID", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Set the parameters for the command.
                command.Parameters.AddWithValue("@userID", userID);

                connection.Open();

                //Execute the query and store the result
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            user.UserID = reader.GetInt32(reader.GetOrdinal("UserID"));
                            user.Username = reader.GetString(reader.GetOrdinal("Username"));
                            user.UserRole = reader.GetString(reader.GetOrdinal("Role"));
                            user.Firstname = reader.GetString(reader.GetOrdinal("Firstname"));
                            user.Surname = reader.GetString(reader.GetOrdinal("Surname"));
                            user.GroupID = reader.GetInt32(reader.GetOrdinal("GroupID"));
                        }
                        reader.Close();
                    }
                    else
                    {
                        return BadRequest("Could not find matching user.");
                    }
                }

                connection.Close();
            }

            //Get user JWT
            user.JWT = CreateJWT(user.UserID, user.Username, user.UserRole);

            //Return OK result with user
            return Ok(new
            {
                user
            });
        }

        /// <summary>
        /// Generates a JWT for the user.
        /// </summary>
        /// <param name="userID"></param>
        /// <param name="username"></param>
        /// <param name="userRole"></param>
        /// <returns>Returns the users JWT as a string.</returns>
        private string CreateJWT(int userID, string username, string userRole)
        {
            //Get secret key from appsettings.json.
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:SecretKey"]));

            //Generate credentials using secret key.
            var credentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            //Create claims.
            var claims = new[]
            {
                new Claim("UserID", userID.ToString()),
                new Claim("Username", username),
                new Claim(ClaimTypes.Role, userRole),
            };

            //Create JWT.
            var jsonWebToken = new JwtSecurityToken(
                issuer: Configuration["JWT:ValidIssuer"],
                audience: Configuration["JWT:ValidAudience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: credentials);

            var jsonWebTokenString = new JwtSecurityTokenHandler().WriteToken(jsonWebToken);

            return jsonWebTokenString;
        }

        /// <summary>
        /// Hashes and salts a password.
        /// </summary>
        /// <param name="password">The plain password to be hashed and salted.</param>
        /// <returns>The hashed and salted password.</returns>
        private string GetPasswordHashAndSalt(string password)
        {
            //Generate random salt value.
            byte[] salt;
            new RNGCryptoServiceProvider().GetBytes(salt = new byte[16]);//128 bit, 16 bytes.

            //Hash and salt the plain text password
            byte[] hash = new Rfc2898DeriveBytes(password, salt, 5000).GetBytes(20);

            //Combine hash and salt.
            byte[] hashSaltPasswordBytes = new byte[36];
            Array.Copy(salt, 0, hashSaltPasswordBytes, 0, 16);
            Array.Copy(hash, 0, hashSaltPasswordBytes, 16, 20);

            //Get string value for the hashed and talted password.
            string hashSaltPassword = Convert.ToBase64String(hashSaltPasswordBytes);

            return hashSaltPassword;
        }

        /// <summary>
        /// Compares plain password to a hashed and salted password.
        /// </summary>
        /// <param name="password">The plain text password entered.</param>
        /// <param name="dbPassword">The hashed and salted password.</param>
        /// <returns>Returns whether the passwords match.</returns>
        public bool VerifyPasswordHashAndSalt(string password, string dbPassword)
        {
            byte[] hashSaltPasswordBytes = Convert.FromBase64String(dbPassword);

            //Get the salt value from the hashed and salted password from the database.
            byte[] dbSalt = new byte[16];
            Array.Copy(hashSaltPasswordBytes, 0, dbSalt, 0, 16);

            //Get the hash value from the hashed and salted password from the database.
            byte[] dbHash = new byte[20];
            Array.Copy(hashSaltPasswordBytes, 16, dbHash, 0, 20);

            //Hash and salt the plain text password using the same salt.
            byte[] hash = new Rfc2898DeriveBytes(password, dbSalt, 5000).GetBytes(20);

            //Compare the hashed passwords.
            for (int i = 0; i < 20; i++)
            {
                //If the hashed passwords don't match, return false.
                if (dbHash[i] != hash[i])
                {
                    return false;
                }
            }

            //Otherwise return true.
            return true;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="userID"></param>
        /// <param name="username"></param>
        /// <param name="userRole"></param>
        /// <returns></returns>
        private string GetUser(int userID)
        {
            return "";
        }
    }
}
