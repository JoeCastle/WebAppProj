namespace WebAppProj.Data.GetQuiz
{
    public class ChoiceDetails
    {
        public string ChoiceText { get; set; }

        public bool isCorrect { get; set; }

        public int QuestionID { get; set; }

        public int ChoiceID { get; set; }

        public int QuizID { get; set; }
    }
}
