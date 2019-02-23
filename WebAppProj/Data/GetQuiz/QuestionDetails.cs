namespace WebAppProj.Data.GetQuiz
{
    public class QuestionDetails
    {
        public string QuestionText { get; set; }

        public int QuizID { get; set; }

        public int QuestionID { get; set; }

        public ChoiceDetails[] Choices { get; set; }
    }
}
