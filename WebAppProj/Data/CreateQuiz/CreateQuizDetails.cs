using WebAppProj.Data.CreateQuiz;

namespace WebAppProj.Data
{
    public class CreateQuizDetails
    {
        public string QuizName { get; set; }

        public int GroupID { get; set; }

        public CreateQuestionDetails[] CreatedQuestions { get; set; }
    }
}
