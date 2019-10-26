-- =============================================
-- Author:		JC
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE Results_GetByQuizIDUserID 
	-- Add the parameters for the stored procedure here
	@quizID int, 
	@userID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT * FROM dbo.Results WHERE @userID = UserID AND @quizID = QuizID
END