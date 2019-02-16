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
    public class QuizController : Controller
    {
        //Initialise configuration, gives access to appsettings.json.
        public QuizController(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        [Authorize(Roles = "trainer")]
        [HttpPost("[action]")]
        public IActionResult CreateQuiz([FromBody] CreateQuizDetails createdQuizDetails)
        {
            var queryResult = -1; //Set query result to fail.
            string connectionString = Configuration["ConnectionStrings:DefaultConnectionString"];
            int result = -1;

            //DataTable tableUsers = new DataTable("Users");
            //tableUsers.Columns.Add("UserID", typeof(int));
            //tableUsers.Columns.Add("GroupID", typeof(int));

            //foreach (UserDetails User in usersToAddToGroup.UserDetails)
            //{
            //    DataRow row = tableUsers.NewRow();
            //    row["UserID"] = User.UserID;
            //    row["GroupID"] = usersToAddToGroup.GroupID;

            //    tableUsers.Rows.Add(row);
            //}

            //using (SqlConnection connection = new SqlConnection(connectionString))
            //{
            //    //Create the SQL command and set type to stored procedure.
            //    SqlCommand command = new SqlCommand("User_RemoveFromGroup", connection);
            //    command.CommandType = System.Data.CommandType.StoredProcedure;

            //    //Set the parameters for the command.
            //    //command.Parameters.Add("@users", SqlDbType.Structured);

            //    //Parameter declaration    
            //    SqlParameter Parameter = new SqlParameter();
            //    Parameter.ParameterName = "@users";
            //    Parameter.SqlDbType = SqlDbType.Structured;
            //    Parameter.Value = tableUsers;

            //    command.Parameters.Add(Parameter);
            //    //command.Parameters.AddWithValue("@groupID", usersToAddToGroup.GroupID);
            //    command.Parameters.Add("@result", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;


            //    //SqlBulkCopy sqlBulkCopy = new SqlBulkCopy();

            //    connection.Open();

            //    //Execute the query and store the result
            //    queryResult = command.ExecuteNonQuery();

            //    result = (int)command.Parameters["@result"].Value;

            //    connection.Close();
            //}

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
