-- =============================================
-- Author:		JC
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[Group_Create] 
	-- Add the parameters for the stored procedure here
	@userID int, 
	@groupName nvarchar(50),
	@result int OUTPUT
AS
BEGIN
	DECLARE @groupID int;
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

	--Check group name already exists
	IF((SELECT COUNT(*) FROM dbo.Groups WHERE GroupName = @groupName) = 0)
	--Create group using group name and user id
	BEGIN
		--If group names does't exist, add group to database.
		INSERT INTO dbo.Groups(GroupName)
		VALUES(@groupName)

		--Update user/trainer using user id and group id
		IF((SELECT COUNT(*) FROM dbo.Users WHERE UserID = @userID) = 1)
		BEGIN
			SELECT @groupID = GroupID from dbo.Groups WHERE GroupName = @groupName
			UPDATE dbo.Users SET GroupID = @groupID WHERE UserID = @userID;
			SET @result = 1;
		END
	END
	ELSE
	BEGIN
		SET @result = 0;
	END
END