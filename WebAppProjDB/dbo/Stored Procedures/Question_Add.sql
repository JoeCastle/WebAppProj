-- =============================================
-- Author:		JC
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[Question_Add] 
	-- Add the parameters for the stored procedure here
	@questionText nvarchar(100),
	@quizID int,
	@choices Quiz_AddChoicesType READONLY,
	@result int OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @questionID int;

    -- Insert statements for procedure here
	--SELECT @p1, @p2

	INSERT INTO dbo.Questions(QuestionText, QuizID) VALUES(@questionText, @quizID)

	SET @questionID = SCOPE_IDENTITY();

	INSERT INTO dbo.Choices(QuestionID, QuizID, ChoiceText, IsCorrect)
	SELECT @questionID, @quizID, ChoiceText, IsCorrect from @choices
	--INSERT INTO dbo.Choices SET GroupID = u.GroupID FROM @choices c WHERE u.UserID = Users.UserID

	IF (@@ROWCOUNT = (SELECT COUNT(*) FROM @choices))
	BEGIN
		SET @result = 1 --Pass
	END
	ELSE 
	BEGIN
		SET @result = 0 --Fail
	END
END