-- =============================================
-- Author:		JC
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE Results_AddByQuestion 
	-- Add the parameters for the stored procedure here
	@userResults Results_InsertType READONLY,
	@result int OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	INSERT INTO dbo.Results(QuestionID, QuizID, ResultValue, UserID)
	SELECT QuestionID, QuizID, ResultValue, UserID from @userResults

	IF (@@ROWCOUNT = (SELECT COUNT(*) FROM @userResults))
	BEGIN
		SET @result = 1 --Pass
	END
	ELSE 
	BEGIN
		SET @result = 0 --Fail
	END
END