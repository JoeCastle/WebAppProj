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
using WebAppProj.Data.CreateQuiz;
using WebAppProj.Data.GetQuiz;

namespace WebAppProj.Controllers
{
    [Route("api/[controller]")]
    public class ResultController : Controller
    {
        //Initialise configuration, gives access to appsettings.json.
        public ResultController(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        [Authorize(Roles = "trainer")]
        [HttpPost("[action]")]
        public IActionResult GetTraineesResultsByQuizID([FromBody] int quizID)
        {
            string connectionString = Configuration["ConnectionStrings:DefaultConnectionString"];

            var trainees = new List<TraineeByQuizDetails>();
            var userIDs = new List<int>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                //Create the SQL command and set type to stored procedure.
                SqlCommand command = new SqlCommand("Results_GetUserByQuizID", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Set the parameters for the command.
                command.Parameters.AddWithValue("@quizID", quizID);

                connection.Open();

                //Execute the query and store the result.
                //Get all quizzes that belong to a group.
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            var userID = reader.GetInt32(reader.GetOrdinal("UserID"));

                            userIDs.Add(userID);
                        }
                        reader.Close();
                    }
                    else
                    {
                        return BadRequest("Could not find matching quiz or users.");
                    }
                }

                foreach (int userID in userIDs)
                {
                    //Create list of all results by a user for a quiz
                    command = new SqlCommand("Results_GetByQuizIDUserID", connection);
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    //Set the parameters for the command.
                    command.Parameters.Clear();
                    command.Parameters.AddWithValue("@quizID", quizID);
                    command.Parameters.AddWithValue("@userID", userID);

                    int quizResult = 0;
                    var questionResults = new List<int>();

                    //Execute the query and store the result
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                int questionResult = reader.GetInt32(reader.GetOrdinal("ResultValue"));

                                questionResults.Add(questionResult);
                            }
                            reader.Close();
                        }
                        else
                        {
                            return BadRequest("Could not find matching result.");
                        }
                    }

                    quizResult = questionResults.Sum();

                    var trainee = new TraineeByQuizDetails();

                    trainee.UserID = userID;
                    trainee.Result = quizResult;

                    trainees.Add(trainee);
                }


                foreach (TraineeByQuizDetails trainee in trainees)
                {
                    //Create list of all results by a user for a quiz
                    command = new SqlCommand("User_GetByID", connection);
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    //Set the parameters for the command.
                    command.Parameters.Clear();
                    command.Parameters.AddWithValue("@userID", trainee.UserID);

                    //Execute the query and store the result.
                    //Get all quizzes that belong to a group.
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                trainee.Firstname = reader.GetString(reader.GetOrdinal("Firstname"));
                                trainee.Surname = reader.GetString(reader.GetOrdinal("Surname"));
                                trainee.Username = reader.GetString(reader.GetOrdinal("Username"));
                            }

                            reader.Close();
                        }
                        else
                        {
                            return BadRequest("Could not find matching user.");
                        }
                    }
                }
            }

            //Return OK result with users and their result for a specific quiz.
            return Ok(
                trainees
            );
        }

    }
}
