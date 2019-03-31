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
            //Create quiz by sending quiz name and group id to quiz_create stored procedure. Return the quiz_id
            //Create a question and it's choices by sending the questiontext, quizid and choice details
            //This will be done 5 times (or how ever many questions there are.)


            var queryResult = -1; //Set query result to fail.
            string connectionString = Configuration["ConnectionStrings:DefaultConnectionString"];
            int result = -1;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                //Create the SQL command and set type to stored procedure.
                SqlCommand command = new SqlCommand("Quiz_Create", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Add parameters to command.
                command.Parameters.AddWithValue("@groupID", createdQuizDetails.GroupID);
                command.Parameters.AddWithValue("@quizName", createdQuizDetails.QuizName);
                command.Parameters.Add("@result", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;

                //Open the connection.
                connection.Open();

                //Execute the query and store the result.
                queryResult = command.ExecuteNonQuery();

                //Get the id for the quiz previously created.
                result = (int)command.Parameters["@result"].Value;

                if (result == 0)
                {
                    //FAIL
                    return BadRequest("Quiz failed to be created.");
                }

                int quizID = result;

                result = 0;

                //Add the questions and options to the previously created quiz.
                command = new SqlCommand("Question_Add", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Create choices datatable.
                DataTable tableChoices = new DataTable("Choices");
                tableChoices.Columns.Add("ChoiceText", typeof(string));
                tableChoices.Columns.Add("IsCorrect", typeof(bool));

                command.Parameters.Add("@questionText", SqlDbType.NVarChar);
                command.Parameters.AddWithValue("@quizID", quizID);

                SqlParameter ChoicesParam = new SqlParameter();
                ChoicesParam.ParameterName = "@choices";
                ChoicesParam.SqlDbType = SqlDbType.Structured;
                //ChoicesParam.Value = tableChoices;

                command.Parameters.Add(ChoicesParam);

                command.Parameters.Add("@result", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;

                //Add rows/data to the questions data table.
                foreach (CreateQuestionDetails Question in createdQuizDetails.CreatedQuestions)
                {
                    tableChoices.Clear();

                    //Add rows/data to the choices data table.
                    foreach (CreateChoiceDetails Choice in Question.CreatedChoices)
                    {
                        DataRow rowChoices = tableChoices.NewRow();
                        rowChoices["ChoiceText"] = Choice.ChoiceText;
                        rowChoices["IsCorrect"] = Choice.isCorrect;

                        tableChoices.Rows.Add(rowChoices);
                    }

                    //Add parameters to command. 
                    command.Parameters["@questionText"].Value = Question.QuestionText;
                    ChoicesParam.Value = tableChoices;

                    //Execute the query and store the result
                    queryResult = command.ExecuteNonQuery();

                    result = result + (int)command.Parameters["@result"].Value;
                }

                connection.Close();
            }

            if (result == createdQuizDetails.CreatedQuestions.Length)
            {
                //SUCCESS
                return Ok("Quiz sucessfilly created.");
            }
            else
            {
                //FAIL
                return BadRequest("Quiz failed to be created.");
            }
        }

        /// <summary>
        /// Gets an array of all quizzes matching a groupID.
        /// </summary>
        /// <param name="groupID">The groupID of the current user.</param>
        /// <returns></returns>
        [Authorize(Roles = "trainer, trainee")]
        [HttpPost("[action]")]
        public IActionResult GetAllQuizzesforGroup([FromBody] int groupID)
        {
            string connectionString = Configuration["ConnectionStrings:DefaultConnectionString"];

            //Create list of all quizzes
            var quizzes = new List<QuizDetails>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                //Create the SQL command and set type to stored procedure.
                SqlCommand command = new SqlCommand("Quizzes_GetByGroupID", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Set the parameters for the command.
                command.Parameters.AddWithValue("@groupID", groupID);

                connection.Open();

                //Execute the query and store the result.
                //Get all quizzes that belong to a group.
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            var quiz = new QuizDetails
                            {
                                GroupID = reader.GetInt32(reader.GetOrdinal("GroupID")),
                                QuizID = reader.GetInt32(reader.GetOrdinal("QuizID")),
                                QuizName = reader.GetString(reader.GetOrdinal("QuizName"))
                            };

                            quizzes.Add(quiz);
                        }
                        reader.Close();
                    }
                    else
                    {
                        return BadRequest("Could not find matching quiz.");
                    }
                }

                //Create list of all questions
                var questions = new List<QuestionDetails>();

                command = new SqlCommand("Questions_GetByQuizID", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Get all questions for each quiz.
                foreach (QuizDetails quiz in quizzes)
                {
                    //Set the parameters for the command.
                    command.Parameters.Clear();
                    command.Parameters.AddWithValue("@quizID", quiz.QuizID);

                    //Execute the query and store the result
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                var question = new QuestionDetails
                                {
                                    QuestionID = reader.GetInt32(reader.GetOrdinal("QuestionID")),
                                    QuizID = reader.GetInt32(reader.GetOrdinal("QuizID")),
                                    QuestionText = reader.GetString(reader.GetOrdinal("QuestionText"))
                                };

                                questions.Add(question);
                            }
                            reader.Close();
                        }
                        else
                        {
                            return BadRequest("Could not find matching questions.");
                        }
                    }
                }

                //Create list of all choices
                var choices = new List<ChoiceDetails>();

                command = new SqlCommand("Choices_GetByQuizID", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Get all choices for each quiz.
                foreach (QuizDetails quiz in quizzes)
                {
                    //Set the parameters for the command.
                    command.Parameters.Clear();
                    command.Parameters.AddWithValue("@quizID", quiz.QuizID);

                    //Execute the query and store the result
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                var choice = new ChoiceDetails
                                {
                                    ChoiceID = reader.GetInt32(reader.GetOrdinal("ChoiceID")),
                                    QuizID = reader.GetInt32(reader.GetOrdinal("QuizID")),
                                    QuestionID = reader.GetInt32(reader.GetOrdinal("QuestionID")),
                                    ChoiceText = reader.GetString(reader.GetOrdinal("ChoiceText")),
                                    isCorrect = reader.GetBoolean(reader.GetOrdinal("IsCorrect"))
                                };

                                choices.Add(choice);
                            }
                            reader.Close();
                        }
                        else
                        {
                            return BadRequest("Could not find matching choices.");
                        }
                    }
                }

                //Add the choices to the matching question item.
                foreach (QuestionDetails question in questions)
                {
                    var temp = new List<ChoiceDetails>();

                    foreach (ChoiceDetails choice in choices)
                    {
                        if (choice.QuestionID == question.QuestionID)
                        {
                            temp.Add(choice);
                        }
                    }
                    question.Choices = temp.ToArray();
                }

                //Add the questions to the matching quiz item.
                foreach (QuizDetails quiz in quizzes)
                {
                    var temp = new List<QuestionDetails>();

                    foreach (QuestionDetails question in questions)
                    {
                        if (question.QuizID == quiz.QuizID)
                        {
                            temp.Add(question);
                        }
                    }
                    quiz.Questions = temp.ToArray();
                }

                connection.Close();
            }

            //Return OK result with quizzes
            return Ok(
                quizzes
            );
        }

        /// <summary>
        /// Gets a quiz by a quizID
        /// </summary>
        /// <param name="quizID"></param>
        /// <returns></returns>
        [Authorize(Roles = "trainer, trainee")]
        [HttpPost("[action]")]
        public IActionResult GetQuizByQuizID([FromBody] int quizID)
        {
            string connectionString = Configuration["ConnectionStrings:DefaultConnectionString"];

            //Create list of all quizzes
            var quiz = new QuizDetails();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                //Create the SQL command and set type to stored procedure.
                SqlCommand command = new SqlCommand("Quiz_GetByQuizID", connection);
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
                            quiz = new QuizDetails
                            {
                                GroupID = reader.GetInt32(reader.GetOrdinal("GroupID")),
                                QuizID = reader.GetInt32(reader.GetOrdinal("QuizID")),
                                QuizName = reader.GetString(reader.GetOrdinal("QuizName"))
                            };
                        }
                        reader.Close();
                    }
                    else
                    {
                        return BadRequest("Could not find matching quiz.");
                    }
                }

                //Create list of all questions
                var questions = new List<QuestionDetails>();

                command = new SqlCommand("Questions_GetByQuizID", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Get all questions for each quiz.

                //Set the parameters for the command.
                command.Parameters.Clear();
                command.Parameters.AddWithValue("@quizID", quiz.QuizID);

                //Execute the query and store the result
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            var question = new QuestionDetails
                            {
                                QuestionID = reader.GetInt32(reader.GetOrdinal("QuestionID")),
                                QuizID = reader.GetInt32(reader.GetOrdinal("QuizID")),
                                QuestionText = reader.GetString(reader.GetOrdinal("QuestionText"))
                            };

                            questions.Add(question);
                        }
                        reader.Close();
                    }
                    else
                    {
                        return BadRequest("Could not find matching questions.");
                    }
                }

                //Create list of all choices
                var choices = new List<ChoiceDetails>();

                command = new SqlCommand("Choices_GetByQuizID", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Set the parameters for the command.
                command.Parameters.Clear();
                command.Parameters.AddWithValue("@quizID", quiz.QuizID);

                //Execute the query and store the result
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            var choice = new ChoiceDetails
                            {
                                ChoiceID = reader.GetInt32(reader.GetOrdinal("ChoiceID")),
                                QuizID = reader.GetInt32(reader.GetOrdinal("QuizID")),
                                QuestionID = reader.GetInt32(reader.GetOrdinal("QuestionID")),
                                ChoiceText = reader.GetString(reader.GetOrdinal("ChoiceText")),
                                isCorrect = reader.GetBoolean(reader.GetOrdinal("IsCorrect"))
                            };

                            choices.Add(choice);
                        }
                        reader.Close();
                    }
                    else
                    {
                        return BadRequest("Could not find matching choices.");
                    }
                }

                //Add the choices to the matching question item.
                foreach (QuestionDetails question in questions)
                {
                    var tempChoices = new List<ChoiceDetails>();

                    foreach (ChoiceDetails choice in choices)
                    {
                        if (choice.QuestionID == question.QuestionID)
                        {
                            tempChoices.Add(choice);
                        }
                    }
                    question.Choices = tempChoices.ToArray();
                }

                quiz.Questions = questions.ToArray();

                connection.Close();
            }

            //Return OK result with quizzes
            return Ok(
                quiz
            );
        }

        /// <summary>
        /// Returns an array of all of the uncompleted quizzes for a trainee
        /// </summary>
        /// <param name="userAndGroupIDDTO"></param>
        /// <returns></returns>
        [Authorize(Roles = "trainee")]
        [HttpPost("[action]")]
        public IActionResult GetUncompletedQuizzesForTrainee([FromBody] TraineeGetQuizzes userAndGroupIDDTO)
        {
            var queryResult = -1; //Set query result to fail.
            string connectionString = Configuration["ConnectionStrings:DefaultConnectionString"];
            int result = -1;

            //Create list of all quizzes
            var quizzes = new List<QuizDetails>();
            var uncompletedQuizzes = new List<QuizDetails>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                //Create the SQL command and set type to stored procedure.
                SqlCommand command = new SqlCommand("Quizzes_GetByGroupID", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Set the parameters for the command.
                command.Parameters.AddWithValue("@groupID", userAndGroupIDDTO.GroupID);

                connection.Open();

                //Execute the query and store the result.
                //Get all quizzes that belong to a group.
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            var quiz = new QuizDetails
                            {
                                GroupID = reader.GetInt32(reader.GetOrdinal("GroupID")),
                                QuizID = reader.GetInt32(reader.GetOrdinal("QuizID")),
                                QuizName = reader.GetString(reader.GetOrdinal("QuizName"))
                            };

                            quizzes.Add(quiz);
                        }
                        reader.Close();
                    }
                    else
                    {
                        return BadRequest("Could not find matching quiz.");
                    }
                }

                //Create list of all questions
                var questions = new List<QuestionDetails>();

                command = new SqlCommand("Questions_GetByQuizID", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Get all questions for each quiz.
                foreach (QuizDetails quiz in quizzes)
                {
                    //Set the parameters for the command.
                    command.Parameters.Clear();
                    command.Parameters.AddWithValue("@quizID", quiz.QuizID);

                    //Execute the query and store the result
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                var question = new QuestionDetails
                                {
                                    QuestionID = reader.GetInt32(reader.GetOrdinal("QuestionID")),
                                    QuizID = reader.GetInt32(reader.GetOrdinal("QuizID")),
                                    QuestionText = reader.GetString(reader.GetOrdinal("QuestionText"))
                                };

                                questions.Add(question);
                            }
                            reader.Close();
                        }
                        else
                        {
                            return BadRequest("Could not find matching questions.");
                        }
                    }
                }

                //Create list of all choices
                var choices = new List<ChoiceDetails>();

                command = new SqlCommand("Choices_GetByQuizID", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Get all choices for each quiz.
                foreach (QuizDetails quiz in quizzes)
                {
                    //Set the parameters for the command.
                    command.Parameters.Clear();
                    command.Parameters.AddWithValue("@quizID", quiz.QuizID);

                    //Execute the query and store the result
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                var choice = new ChoiceDetails
                                {
                                    ChoiceID = reader.GetInt32(reader.GetOrdinal("ChoiceID")),
                                    QuizID = reader.GetInt32(reader.GetOrdinal("QuizID")),
                                    QuestionID = reader.GetInt32(reader.GetOrdinal("QuestionID")),
                                    ChoiceText = reader.GetString(reader.GetOrdinal("ChoiceText")),
                                    isCorrect = reader.GetBoolean(reader.GetOrdinal("IsCorrect"))
                                };

                                choices.Add(choice);
                            }
                            reader.Close();
                        }
                        else
                        {
                            return BadRequest("Could not find matching choices.");
                        }
                    }
                }

                //Add the choices to the matching question item.
                foreach (QuestionDetails question in questions)
                {
                    var temp = new List<ChoiceDetails>();

                    foreach (ChoiceDetails choice in choices)
                    {
                        if (choice.QuestionID == question.QuestionID)
                        {
                            temp.Add(choice);
                        }
                    }
                    question.Choices = temp.ToArray();
                }

                //Add the questions to the matching quiz item.
                foreach (QuizDetails quiz in quizzes)
                {
                    var temp = new List<QuestionDetails>();

                    foreach (QuestionDetails question in questions)
                    {
                        if (question.QuizID == quiz.QuizID)
                        {
                            temp.Add(question);
                        }
                    }
                    quiz.Questions = temp.ToArray();
                }

                //Create the SQL command and set type to stored procedure.
                command = new SqlCommand("Results_CheckIfQuizCompleted", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                foreach (QuizDetails quiz in quizzes)
                {
                    //Set the parameters for the command.
                    command.Parameters.Clear();
                    command.Parameters.AddWithValue("@quizID", quiz.QuizID);
                    command.Parameters.AddWithValue("@userID", userAndGroupIDDTO.UserID);
                    command.Parameters.Add("@result", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;

                    //Execute the query and store the result.
                    queryResult = command.ExecuteNonQuery();

                    //Get the id for the quiz previously created.
                    result = (int)command.Parameters["@result"].Value;

                    if (result == 0)
                    {
                        uncompletedQuizzes.Add(quiz);
                    }
                }

                connection.Close();
            }

            //Return OK result with uncompleted quizzes
            return Ok(
                uncompletedQuizzes
            );
        }

        /// <summary>
        /// Returns an array of all of the uncompleted quizzes for a trainee
        /// </summary>
        /// <param name="userAndGroupIDDTO"></param>
        /// <returns></returns>
        [Authorize(Roles = "trainee")]
        [HttpPost("[action]")]
        public IActionResult GetCompletedQuizzesForTrainee([FromBody] TraineeGetQuizzes userAndGroupIDDTO)
        {
            var queryResult = -1; //Set query result to fail.
            string connectionString = Configuration["ConnectionStrings:DefaultConnectionString"];
            int result = -1;

            //Create list of all quizzes
            var quizzes = new List<QuizDetails>();
            var completedQuizzes = new List<QuizDetails>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                //Create the SQL command and set type to stored procedure.
                SqlCommand command = new SqlCommand("Quizzes_GetByGroupID", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Set the parameters for the command.
                command.Parameters.AddWithValue("@groupID", userAndGroupIDDTO.GroupID);

                connection.Open();

                //Execute the query and store the result.
                //Get all quizzes that belong to a group.
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            var quiz = new QuizDetails
                            {
                                GroupID = reader.GetInt32(reader.GetOrdinal("GroupID")),
                                QuizID = reader.GetInt32(reader.GetOrdinal("QuizID")),
                                QuizName = reader.GetString(reader.GetOrdinal("QuizName"))
                            };

                            quizzes.Add(quiz);
                        }
                        reader.Close();
                    }
                    else
                    {
                        return BadRequest("Could not find matching quiz.");
                    }
                }

                //Create list of all questions
                var questions = new List<QuestionDetails>();

                command = new SqlCommand("Questions_GetByQuizID", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Get all questions for each quiz.
                foreach (QuizDetails quiz in quizzes)
                {
                    //Set the parameters for the command.
                    command.Parameters.Clear();
                    command.Parameters.AddWithValue("@quizID", quiz.QuizID);

                    //Execute the query and store the result
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                var question = new QuestionDetails
                                {
                                    QuestionID = reader.GetInt32(reader.GetOrdinal("QuestionID")),
                                    QuizID = reader.GetInt32(reader.GetOrdinal("QuizID")),
                                    QuestionText = reader.GetString(reader.GetOrdinal("QuestionText"))
                                };

                                questions.Add(question);
                            }
                            reader.Close();
                        }
                        else
                        {
                            return BadRequest("Could not find matching questions.");
                        }
                    }
                }

                //Create list of all choices
                var choices = new List<ChoiceDetails>();

                command = new SqlCommand("Choices_GetByQuizID", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Get all choices for each quiz.
                foreach (QuizDetails quiz in quizzes)
                {
                    //Set the parameters for the command.
                    command.Parameters.Clear();
                    command.Parameters.AddWithValue("@quizID", quiz.QuizID);

                    //Execute the query and store the result
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                var choice = new ChoiceDetails
                                {
                                    ChoiceID = reader.GetInt32(reader.GetOrdinal("ChoiceID")),
                                    QuizID = reader.GetInt32(reader.GetOrdinal("QuizID")),
                                    QuestionID = reader.GetInt32(reader.GetOrdinal("QuestionID")),
                                    ChoiceText = reader.GetString(reader.GetOrdinal("ChoiceText")),
                                    isCorrect = reader.GetBoolean(reader.GetOrdinal("IsCorrect"))
                                };

                                choices.Add(choice);
                            }
                            reader.Close();
                        }
                        else
                        {
                            return BadRequest("Could not find matching choices.");
                        }
                    }
                }

                //Add the choices to the matching question item.
                foreach (QuestionDetails question in questions)
                {
                    var temp = new List<ChoiceDetails>();

                    foreach (ChoiceDetails choice in choices)
                    {
                        if (choice.QuestionID == question.QuestionID)
                        {
                            temp.Add(choice);
                        }
                    }
                    question.Choices = temp.ToArray();
                }

                //Add the questions to the matching quiz item.
                foreach (QuizDetails quiz in quizzes)
                {
                    var temp = new List<QuestionDetails>();

                    foreach (QuestionDetails question in questions)
                    {
                        if (question.QuizID == quiz.QuizID)
                        {
                            temp.Add(question);
                        }
                    }
                    quiz.Questions = temp.ToArray();
                }

                //Create the SQL command and set type to stored procedure.
                command = new SqlCommand("Results_CheckIfQuizCompleted", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                foreach (QuizDetails quiz in quizzes)
                {
                    //Set the parameters for the command.
                    command.Parameters.Clear();
                    command.Parameters.AddWithValue("@quizID", quiz.QuizID);
                    command.Parameters.AddWithValue("@userID", userAndGroupIDDTO.UserID);
                    command.Parameters.Add("@result", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;

                    //Execute the query and store the result.
                    queryResult = command.ExecuteNonQuery();

                    //Get the id for the quiz previously created.
                    result = (int)command.Parameters["@result"].Value;

                    if (result == 1)
                    {
                        completedQuizzes.Add(quiz);
                    }
                }

                connection.Close();
            }

            //Return OK result with uncompleted quizzes
            return Ok(
                completedQuizzes
            );
        }

        [Authorize(Roles = "trainee")]
        [HttpPost("[action]")]
        public IActionResult SubmitQuizResults([FromBody] SubmitQuizResultsDetails[] submitQuizResultsDetailsDTO)
        {
            var queryResult = -1; //Set query result to fail.
            string connectionString = Configuration["ConnectionStrings:DefaultConnectionString"];
            int result = -1;

            DataTable tableResults = new DataTable("Results");
            tableResults.Columns.Add("QuestionID", typeof(int));
            tableResults.Columns.Add("ResultValue", typeof(int));
            tableResults.Columns.Add("UserID", typeof(int));
            tableResults.Columns.Add("QuizID", typeof(int));

            foreach (SubmitQuizResultsDetails Result in submitQuizResultsDetailsDTO)
            {
                DataRow row = tableResults.NewRow();
                row["QuestionID"] = Result.QuestionID;
                row["ResultValue"] = Result.ResultValue;
                row["UserID"] = Result.UserID;
                row["QuizID"] = Result.QuizID;

                tableResults.Rows.Add(row);
            }

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                //Create the SQL command and set type to stored procedure.
                SqlCommand command = new SqlCommand("Results_AddByQuestion", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Parameter declaration    
                SqlParameter Parameter = new SqlParameter();
                Parameter.ParameterName = "@userResults";
                Parameter.SqlDbType = SqlDbType.Structured;
                Parameter.Value = tableResults;

                command.Parameters.Add(Parameter);

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
                return Ok("Results successfully added.");
            }
            else
            {
                //FAIL
                return BadRequest("Failed to add results.");
            }
        }

        [Authorize(Roles = "trainee")]
        [HttpPost("[action]")]
        public IActionResult GetQuizResults([FromBody] TraineeGetQuizResults traineeGetQuizResultsDTO)
        {
            string connectionString = Configuration["ConnectionStrings:DefaultConnectionString"];

            //Create list of all quizzes
            var quizResults = new QuizResults();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                //Create the SQL command and set type to stored procedure.
                SqlCommand command = new SqlCommand("Quiz_GetByQuizID", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Set the parameters for the command.
                command.Parameters.AddWithValue("@quizID", traineeGetQuizResultsDTO.QuizID);

                connection.Open();

                //Execute the query and store the result.
                //Get all quizzes that belong to a group.
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            quizResults = new QuizResults
                            {
                                GroupID = reader.GetInt32(reader.GetOrdinal("GroupID")),
                                QuizID = reader.GetInt32(reader.GetOrdinal("QuizID")),
                                QuizName = reader.GetString(reader.GetOrdinal("QuizName"))
                            };
                        }
                        reader.Close();
                    }
                    else
                    {
                        return BadRequest("Could not find matching quiz.");
                    }
                }

                //Create list of all questions
                var questions = new List<Data.GetQuizResults.QuestionDetails>();

                command = new SqlCommand("Questions_GetByQuizID", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Get all questions for each quiz.

                //Set the parameters for the command.
                command.Parameters.Clear();
                command.Parameters.AddWithValue("@quizID", traineeGetQuizResultsDTO.QuizID);

                //Execute the query and store the result
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            var question = new Data.GetQuizResults.QuestionDetails
                            {
                                QuestionID = reader.GetInt32(reader.GetOrdinal("QuestionID")),
                                QuizID = reader.GetInt32(reader.GetOrdinal("QuizID")),
                                QuestionText = reader.GetString(reader.GetOrdinal("QuestionText"))
                            };

                            questions.Add(question);
                        }
                        reader.Close();
                    }
                    else
                    {
                        return BadRequest("Could not find matching questions.");
                    }
                }

                //Create list of all choices
                var choices = new List<Data.GetQuizResults.ChoiceDetails>();

                command = new SqlCommand("Choices_GetByQuizID", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Set the parameters for the command.
                command.Parameters.Clear();
                command.Parameters.AddWithValue("@quizID", traineeGetQuizResultsDTO.QuizID);

                //Execute the query and store the result
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            var choice = new Data.GetQuizResults.ChoiceDetails
                            {
                                ChoiceID = reader.GetInt32(reader.GetOrdinal("ChoiceID")),
                                QuizID = reader.GetInt32(reader.GetOrdinal("QuizID")),
                                QuestionID = reader.GetInt32(reader.GetOrdinal("QuestionID")),
                                ChoiceText = reader.GetString(reader.GetOrdinal("ChoiceText")),
                                isCorrect = reader.GetBoolean(reader.GetOrdinal("IsCorrect"))
                            };

                            choices.Add(choice);
                        }
                        reader.Close();
                    }
                    else
                    {
                        return BadRequest("Could not find matching choices.");
                    }
                }

                //Add the choices to the matching question item.
                foreach (Data.GetQuizResults.QuestionDetails question in questions)
                {
                    var tempChoices = new List<Data.GetQuizResults.ChoiceDetails>();

                    foreach (Data.GetQuizResults.ChoiceDetails choice in choices)
                    {
                        if (choice.QuestionID == question.QuestionID)
                        {
                            tempChoices.Add(choice);
                        }
                    }
                    question.Choices = tempChoices.ToArray();
                }

                quizResults.Questions = questions.ToArray();

                var results = new List<TraineeQuizResults>();

                command = new SqlCommand("Results_GetByQuizIDUserID", connection);
                command.CommandType = System.Data.CommandType.StoredProcedure;

                //Set the parameters for the command.
                command.Parameters.Clear();
                command.Parameters.AddWithValue("@quizID", traineeGetQuizResultsDTO.QuizID);
                command.Parameters.AddWithValue("@userID", traineeGetQuizResultsDTO.UserID);

                //Execute the query and store the result
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            var result = new TraineeQuizResults
                            {
                                ResultValue = reader.GetInt32(reader.GetOrdinal("ResultValue")),
                                QuizID = reader.GetInt32(reader.GetOrdinal("QuizID")),
                                QuestionID = reader.GetInt32(reader.GetOrdinal("QuestionID")),
                                UserID = reader.GetInt32(reader.GetOrdinal("UserID")),
                                ResultID = reader.GetInt32(reader.GetOrdinal("ResultID"))
                            };

                            results.Add(result);
                        }
                        reader.Close();
                    }
                    else
                    {
                        return BadRequest("Could not find matching results.");
                    }
                }

                foreach (Data.GetQuizResults.QuestionDetails question in quizResults.Questions)
                {
                    foreach (TraineeQuizResults result in results)
                    {
                        if (question.QuestionID == result.QuestionID)
                        {
                            question.Result = result.ResultValue;
                        }
                    }
                }

                connection.Close();
            }

            //Return OK result with quizzes
            return Ok(
                quizResults
            );
        }
    }
}
