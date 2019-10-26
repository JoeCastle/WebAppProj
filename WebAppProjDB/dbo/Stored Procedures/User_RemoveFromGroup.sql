-- =============================================
-- Author:		JC
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[User_RemoveFromGroup] 
	-- Add the parameters for the stored procedure here
	@users User_UpdateGroupType READONLY,
	@result int OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	UPDATE dbo.Users SET GroupID = 1 FROM @users u WHERE u.UserID = Users.UserID AND Role = 'trainee'
END

IF (@@ROWCOUNT = (SELECT COUNT(*) FROM @users))
BEGIN
	SET @result = 1 --Pass
END
ELSE 
BEGIN
	SET @result = 0 --Fail
END