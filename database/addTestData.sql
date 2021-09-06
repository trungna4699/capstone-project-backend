USE Speckio;

# All users created with password: 'password'.
INSERT INTO Speckio.Users (firstName, lastName, email, password, orgID, isRegistered)
VALUES
	('John','Smith','johns@speckio.com','$2b$10$H2h6c6IJ2PwUn2DxZMqhXukvAUDNWZrKdCcT4lVQ.JT/eHpbQ92He',1, true),
	('Jane','Doe','janed@speckio.com','$2b$10$H2h6c6IJ2PwUn2DxZMqhXukvAUDNWZrKdCcT4lVQ.JT/eHpbQ92He',1, true),
	('George','Adams','georgea@speckio.com','$2b$10$H2h6c6IJ2PwUn2DxZMqhXukvAUDNWZrKdCcT4lVQ.JT/eHpbQ92He',1, true),
	('Lucy','Barnes','lucyb@speckio.com','$2b$10$H2h6c6IJ2PwUn2DxZMqhXukvAUDNWZrKdCcT4lVQ.JT/eHpbQ92He',1, false);

INSERT INTO Speckio.Teams (teamName, teamLeaderID, teamDescription)
VALUES
	('Speckio Development Team',2,'Web development team at Speckio.');
    
INSERT INTO Speckio.TeamMembers
VALUES
	(1, 1, true),
	(1, 2, true),
	(1, 3, true),
	(1, 4, false),
    (1, 5, false);
    
INSERT INTO Speckio.DiscResults
VALUES
	(1, 1),
	(2, 2),
	(3, 3),
	(4, 4);

# Gives userID 1 all high EQi results, userID 2 and 3 all mid EQi results and userID 4 all low results
INSERT INTO Speckio.EQiResults
VALUES
	(1, 1, 3, 115),
	(1, 2, 6, 115),
	(1, 3, 9, 115),
	(1, 4, 12, 115),
	(1, 5, 15, 115),
	(1, 6, 18, 115),
	(1, 7, 21, 115),
	(1, 8, 24, 115),
	(1, 9, 27, 115),
	(1, 10, 30, 115),
	(1, 11, 33, 115),
	(1, 12, 36, 115),
	(1, 13, 39, 115),
	(1, 14, 42, 115),
	(1, 15, 45, 115),
	(2, 1, 2, 102),
	(2, 2, 5, 102),
	(2, 3, 8, 102),
	(2, 4, 11, 102),
	(2, 5, 14, 102),
	(2, 6, 17, 102),
	(2, 7, 20, 102),
	(2, 8, 23, 102),
	(2, 9, 26, 102),
	(2, 10, 29, 102),
	(2, 11, 32, 102),
	(2, 12, 35, 102),
	(2, 13, 38, 102),
	(2, 14, 41, 102),
	(2, 15, 44, 102),
	(3, 1, 2, 102),
	(3, 2, 5, 102),
	(3, 3, 8, 102),
	(3, 4, 11, 102),
	(3, 5, 14, 102),
	(3, 6, 17, 102),
	(3, 7, 20, 102),
	(3, 8, 23, 102),
	(3, 9, 26, 102),
	(3, 10, 29, 102),
	(3, 11, 32, 102),
	(3, 12, 35, 102),
	(3, 13, 38, 102),
	(3, 14, 41, 102),
	(3, 15, 44, 102),
	(4, 1, 1, 88),
	(4, 2, 4, 88),
	(4, 3, 7, 88),
	(4, 4, 10, 88),
	(4, 5, 13, 88),
	(4, 6, 16, 88),
	(4, 7, 19, 88),
	(4, 8, 22, 88),
	(4, 9, 25, 88),
	(4, 10, 28, 88),
	(4, 11, 31, 88),
	(4, 12, 34, 88),
	(4, 13, 37, 88),
	(4, 14, 40, 88),
	(4, 15, 43, 88);