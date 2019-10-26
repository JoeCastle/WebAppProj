-- =============================================
-- Author:		JC
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[User_GetByID] 
	-- Add the parameters for the stored procedure here
	@userID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	IF((SELECT COUNT(*) FROM dbo.Users WHERE UserID = @userID) = 1)
	BEGIN
		SELECT * FROM dbo.Users WHERE UserID = @userID
	END
END