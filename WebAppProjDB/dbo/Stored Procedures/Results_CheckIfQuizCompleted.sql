-- =============================================
-- Author:		JC
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[Results_CheckIfQuizCompleted] 
	-- Add the parameters for the stored procedure here
	@userID int, 
	@quizID int,
	@result int OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	
	IF((SELECT COUNT(*) FROM dbo.Results WHERE UserID = @userID AND QuizID = @quizID) = 0)
	BEGIN
		SET @result = 0;
	END
	ELSE
	BEGIN
		SET @result = 1;
	END
END