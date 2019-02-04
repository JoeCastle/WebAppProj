﻿using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using WebAppProj.Data;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

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

        //TODO: Change to check role, trainer, not trainee
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
    }
}