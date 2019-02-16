namespace WebAppProj.Data.CreateQuiz
{
    public class CreateQuestionDetails
    {
        public string QuestionText { get; set; }

        public CreateChoiceDetails[] CreatedChoices { get; set; }
    }
}
