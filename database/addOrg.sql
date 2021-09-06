USE Speckio;

# Creates a default organisation
INSERT INTO Speckio.Organisations(orgName, tierID, isActive)
VALUES
	('Speckio', 3, true);
    
# Creates a default user, password is 'password'
INSERT INTO Speckio.Users(firstName, lastName, email, password, orgID, isRegistered)
VALUES
	('Speckio', 'Admin', 'admin@speckio.com', '$2b$10$H2h6c6IJ2PwUn2DxZMqhXukvAUDNWZrKdCcT4lVQ.JT/eHpbQ92He', 1, true);
    
# Adds default user as an admin for default organisation
INSERT INTO Speckio.Admins
VALUES
	(1,1);