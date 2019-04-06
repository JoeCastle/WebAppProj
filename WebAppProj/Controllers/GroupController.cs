using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using WebAppProj.Data;

namespace WebAppProj.Controllers
{
    [Route("api/[controller]")]
    public class GroupController : Controller
    {
        //Initialise configuration, gives access to appsettings.json.
        public GroupController(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        [Authorize(Roles = "trainer")]
        [HttpPost("[action]")]
        public IActionResult CreateGroup([FromBody] CreateGroupDetails createGroupDetails)
        {
            var queryResult = -1; //Set query result to fail.
            string connectionString = Configuration["ConnectionStrings:DefaultConnectionString"];
            int result = -1;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                //Create the SQL command and set type to stored procedure.
                SqlCommand command = new SqlCommand("Group_Create", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Set the parameters for the command.
                command.Parameters.AddWithValue("@userID", createGroupDetails.UserID);
                command.Parameters.AddWithValue("@groupName", createGroupDetails.GroupName);
                command.Parameters.Add("@result", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;

                connection.Open();

                //Execute the query and store the result
                queryResult = command.ExecuteNonQuery();

                result = (int)command.Parameters["@result"].Value;

                connection.Close();
            }

            if (result == 1)
            {
                //SUCCESS
                return Ok("Group created.");
            }
            else
            {
                //FAIL
                return BadRequest("Failed to add group, group name already exists.");
            }
        }

        [Authorize(Roles = "trainer")]
        [HttpPost("[action]")]
        public IActionResult GetUsersInGroup([FromBody] int groupID)
        {
            string connectionString = Configuration["ConnectionStrings:DefaultConnectionString"];

            //Create user
            var users = new List<UserDetails>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                //Create the SQL command and set type to stored procedure.
                SqlCommand command = new SqlCommand("User_GetInGroup", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Set the parameters for the command.
                command.Parameters.AddWithValue("@groupID", groupID);

                connection.Open();

                //Execute the query and store the result
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            var user = new UserDetails
                            {
                                UserID = reader.GetInt32(reader.GetOrdinal("UserID")),
                                Username = reader.GetString(reader.GetOrdinal("Username")),
                                UserRole = reader.GetString(reader.GetOrdinal("Role")),
                                Firstname = reader.GetString(reader.GetOrdinal("Firstname")),
                                Surname = reader.GetString(reader.GetOrdinal("Surname")),
                                GroupID = reader.GetInt32(reader.GetOrdinal("GroupID"))
                            };

                            users.Add(user);
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

            //Return OK result with user
            return Ok(
                users
            );
        }

        [Authorize(Roles = "trainer")]
        [HttpPost("[action]")]
        public IActionResult GetUsersNotInGroup()
        {
            string connectionString = Configuration["ConnectionStrings:DefaultConnectionString"];

            //Create user
            List<UserDetails> users = new List<UserDetails>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                //Create the SQL command and set type to stored procedure.
                SqlCommand command = new SqlCommand("User_GetNotInGroup", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                connection.Open();

                //Execute the query and store the result
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            var user = new UserDetails
                            {
                                UserID = reader.GetInt32(reader.GetOrdinal("UserID")),
                                Username = reader.GetString(reader.GetOrdinal("Username")),
                                UserRole = reader.GetString(reader.GetOrdinal("Role")),
                                Firstname = reader.GetString(reader.GetOrdinal("Firstname")),
                                Surname = reader.GetString(reader.GetOrdinal("Surname")),
                                GroupID = reader.GetInt32(reader.GetOrdinal("GroupID"))
                            };

                            users.Add(user);
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

            //Return OK result with users (not new users)
            return Ok(
                users
            );
        }

        [Authorize(Roles = "trainer")]
        [HttpPost("[action]")]
        public IActionResult GetCurrentGroupDetails([FromBody] int groupID)
        {
            string connectionString = Configuration["ConnectionStrings:DefaultConnectionString"];

            //Create user
            var user = new CurrentUserDetails();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                //Create the SQL command and set type to stored procedure.
                SqlCommand command = new SqlCommand("User_GetByGroupID", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Set the parameters for the command.
                command.Parameters.AddWithValue("@groupID", groupID);

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

            //Return OK result with user
            return Ok(new
            {
                user
            });
        }

        //https://stackoverflow.com/questions/886293/how-do-i-execute-a-stored-procedure-once-for-each-row-returned-by-query
        //https://www.aspsnippets.com/Articles/Send-Pass-DataTable-as-parameter-to-Stored-Procedure-in-C-and-VBNet.aspx
        //https://www.codeproject.com/Articles/412802/Sending-a-DataTable-to-a-Stored-Procedure
        [Authorize(Roles = "trainer")]
        [HttpPost("[action]")]
        public IActionResult AddUsersToGroup([FromBody] UsersToAddToGroup usersToAddToGroup)
        {
            var queryResult = -1; //Set query result to fail.
            string connectionString = Configuration["ConnectionStrings:DefaultConnectionString"];
            int result = -1;

            DataTable tableUsers = new DataTable("Users");
            tableUsers.Columns.Add("UserID", typeof(int));
            tableUsers.Columns.Add("GroupID", typeof(int));

            foreach (UserDetails User in usersToAddToGroup.UserDetails)
            {
                DataRow row = tableUsers.NewRow();
                row["UserID"] = User.UserID;
                row["GroupID"] = usersToAddToGroup.GroupID;

                tableUsers.Rows.Add(row);
            }

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                //Create the SQL command and set type to stored procedure.
                SqlCommand command = new SqlCommand("User_AddToGroup", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Set the parameters for the command.
                //command.Parameters.Add("@users", SqlDbType.Structured);

                //Parameter declaration    
                SqlParameter Parameter = new SqlParameter();
                Parameter.ParameterName = "@users";
                Parameter.SqlDbType = SqlDbType.Structured;
                Parameter.Value = tableUsers;

                command.Parameters.Add(Parameter);
                //command.Parameters.AddWithValue("@groupID", usersToAddToGroup.GroupID);
                command.Parameters.Add("@result", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;


                //SqlBulkCopy sqlBulkCopy = new SqlBulkCopy();

                connection.Open();

                //Execute the query and store the result
                queryResult = command.ExecuteNonQuery();

                result = (int)command.Parameters["@result"].Value;

                connection.Close();
            }

            if (result == 1)
            {
                //SUCCESS
                return Ok("Users successfully added to group.");
            }
            else
            {
                //FAIL
                return BadRequest("Failed to add users to group.");
            }
        }

        [Authorize(Roles = "trainer")]
        [HttpPost("[action]")]
        public IActionResult RemoveUsersFromGroup([FromBody] UsersToAddToGroup usersToAddToGroup)
        {
            var queryResult = -1; //Set query result to fail.
            string connectionString = Configuration["ConnectionStrings:DefaultConnectionString"];
            int result = -1;

            DataTable tableUsers = new DataTable("Users");
            tableUsers.Columns.Add("UserID", typeof(int));
            tableUsers.Columns.Add("GroupID", typeof(int));

            foreach (UserDetails User in usersToAddToGroup.UserDetails)
            {
                DataRow row = tableUsers.NewRow();
                row["UserID"] = User.UserID;
                row["GroupID"] = usersToAddToGroup.GroupID;

                tableUsers.Rows.Add(row);
            }

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                //Create the SQL command and set type to stored procedure.
                SqlCommand command = new SqlCommand("User_RemoveFromGroup", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Set the parameters for the command.
                //command.Parameters.Add("@users", SqlDbType.Structured);

                //Parameter declaration    
                SqlParameter Parameter = new SqlParameter();
                Parameter.ParameterName = "@users";
                Parameter.SqlDbType = SqlDbType.Structured;
                Parameter.Value = tableUsers;

                command.Parameters.Add(Parameter);
                //command.Parameters.AddWithValue("@groupID", usersToAddToGroup.GroupID);
                command.Parameters.Add("@result", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;


                //SqlBulkCopy sqlBulkCopy = new SqlBulkCopy();

                connection.Open();

                //Execute the query and store the result
                queryResult = command.ExecuteNonQuery();

                result = (int)command.Parameters["@result"].Value;

                connection.Close();
            }

            if (result == 1)
            {
                //SUCCESS
                return Ok("Users successfully removed from group.");
            }
            else
            {
                //FAIL
                return BadRequest("Failed to remove users from group.");
            }
        }
    }
}
