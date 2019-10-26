CREATE TABLE [dbo].[Users] (
    [UserID]    INT           IDENTITY (1, 1) NOT NULL,
    [Username]  NVARCHAR (50) NOT NULL,
    [Password]  NVARCHAR (50) NOT NULL,
    [Firstname] NVARCHAR (50) NOT NULL,
    [Surname]   NVARCHAR (50) NOT NULL,
    [Role]      NVARCHAR (50) NOT NULL,
    [GroupID]   INT           NOT NULL,
    CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED ([UserID] ASC),
    CONSTRAINT [FK_User_Groups] FOREIGN KEY ([GroupID]) REFERENCES [dbo].[Groups] ([GroupID])
);

