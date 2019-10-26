-- =============================================
-- Author:		JC
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE Results_GetUserByQuizID 
	-- Add the parameters for the stored procedure here
	@quizID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT DISTINCT UserID FROM dbo.Results WHERE @quizID = QuizID
END