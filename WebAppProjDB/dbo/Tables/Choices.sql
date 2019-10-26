CREATE TABLE [dbo].[Choices] (
    [ChoiceID]   INT           IDENTITY (1, 1) NOT NULL,
    [QuestionID] INT           NOT NULL,
    [ChoiceText] NVARCHAR (50) NOT NULL,
    [IsCorrect]  BIT           NOT NULL,
    [QuizID]     INT           NOT NULL,
    CONSTRAINT [PK_Choices] PRIMARY KEY CLUSTERED ([ChoiceID] ASC),
    CONSTRAINT [FK_Choices_Questions] FOREIGN KEY ([QuestionID]) REFERENCES [dbo].[Questions] ([QuestionID]),
    CONSTRAINT [FK_Choices_Quizzes] FOREIGN KEY ([QuizID]) REFERENCES [dbo].[Quizzes] ([QuizID])
);

