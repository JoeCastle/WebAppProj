using WebAppProj.Data.GetQuizResults;

namespace WebAppProj.Data
{
    public class QuizResults
    {
        public string QuizName { get; set; }

        public int GroupID { get; set; }

        public int QuizID { get; set; }

        public QuestionDetails[] Questions { get; set; }
    }
}
