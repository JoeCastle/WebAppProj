-- =============================================
-- Author:		JC
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[User_Login] 
	-- Add the parameters for the stored procedure here
	@username nvarchar(50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	IF((SELECT COUNT(*) FROM dbo.Users WHERE Username = @username) = 1)
	BEGIN
		SELECT * FROM dbo.Users WHERE Username = @username
	END
END