-- =============================================
-- Author:		JC
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[Quiz_Create] 
	-- Add the parameters for the stored procedure here
	@groupID int,
	@quizName nvarchar(50),
	@result int OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @quizID int = 0;

    -- Insert statements for procedure here
	
	INSERT INTO dbo.Quizzes(QuizName, GroupID) VALUES(@quizName, @groupID)

	SET @result = SCOPE_IDENTITY();
END