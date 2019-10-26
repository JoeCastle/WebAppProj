-- =============================================
-- Author:		JC
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[User_Register] 
	-- Add the parameters for the stored procedure here
	@username nvarchar(50),
	@password nvarchar(50),
	@role nvarchar(50),
	@firstname nvarchar(50),
	@surname nvarchar(50),
	@groupid int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	--SET NOCOUNT ON;

    -- Insert statements for procedure here
	--Check if a user already exists before registering them/adding them to the database
	IF((SELECT COUNT(*) FROM dbo.Users WHERE Username = @username) = 0)
	BEGIN
		INSERT INTO dbo.Users(Username, Password, Firstname, Surname, Role, GroupID)
		VALUES(@username, @password, @firstname, @surname, @role, @groupid)
	END
END