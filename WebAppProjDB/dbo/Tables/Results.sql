CREATE TABLE [dbo].[Results] (
    [ResultID]    INT IDENTITY (1, 1) NOT NULL,
    [QuestionID]  INT NOT NULL,
    [ResultValue] INT NOT NULL,
    [UserID]      INT NOT NULL,
    [QuizID]      INT NOT NULL,
    CONSTRAINT [PK_Results] PRIMARY KEY CLUSTERED ([ResultID] ASC),
    CONSTRAINT [FK_Results_Questions] FOREIGN KEY ([QuestionID]) REFERENCES [dbo].[Questions] ([QuestionID]),
    CONSTRAINT [FK_Results_Quizzes] FOREIGN KEY ([QuizID]) REFERENCES [dbo].[Quizzes] ([QuizID]),
    CONSTRAINT [FK_Results_User] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([UserID])
);

