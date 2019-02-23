using WebAppProj.Data.GetQuiz;

namespace WebAppProj.Data
{
    public class QuizDetails
    {
        public string QuizName { get; set; }

        public int GroupID { get; set; }

        public int QuizID { get; set; }

        public QuestionDetails[] Questions { get; set; }
    }
}
