CREATE TABLE [dbo].[Questions] (
    [QuestionID]   INT           IDENTITY (1, 1) NOT NULL,
    [QuizID]       INT           NOT NULL,
    [QuestionText] NVARCHAR (50) NOT NULL,
    CONSTRAINT [PK_Questions] PRIMARY KEY CLUSTERED ([QuestionID] ASC),
    CONSTRAINT [FK_Questions_Quizzes] FOREIGN KEY ([QuizID]) REFERENCES [dbo].[Quizzes] ([QuizID])
);

