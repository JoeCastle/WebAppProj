-- =============================================
-- Author:		JC
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[User_GetInGroup] 
	-- Add the parameters for the stored procedure here
	@groupID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT * FROM dbo.Users WHERE GroupID = @groupID AND Role = 'trainee'
END