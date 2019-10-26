CREATE TABLE [dbo].[Quizzes] (
    [QuizID]   INT           IDENTITY (1, 1) NOT NULL,
    [GroupID]  INT           NOT NULL,
    [QuizName] NVARCHAR (50) NOT NULL,
    CONSTRAINT [PK_Quizzes] PRIMARY KEY CLUSTERED ([QuizID] ASC),
    CONSTRAINT [FK_Quizzes_Groups] FOREIGN KEY ([GroupID]) REFERENCES [dbo].[Groups] ([GroupID])
);

