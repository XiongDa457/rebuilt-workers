DROP TABLE IF EXISTS Announcements;
DROP TABLE IF EXISTS PartsRequests;

DROP TABLE IF EXISTS TeamToMatch;
DROP TABLE IF EXISTS ScouterToMatch;

DROP TABLE IF EXISTS Teams;
DROP TABLE IF EXISTS Scouters;
DROP TABLE IF EXISTS Matches;

CREATE TABLE IF NOT EXISTS Announcements (
  ID TEXT PRIMARY KEY,
  Time INTEGER,
  Message TEXT
);

CREATE TABLE IF NOT EXISTS PartsRequests (
  ReqID TEXT PRIMARY KEY,
  Time INTEGER,
  Team INTEGER,
  Parts TEXT
);

CREATE TABLE IF NOT EXISTS Teams (
  TeamNumber INTEGER PRIMARY KEY,
  PitsData TEXT
);

CREATE TABLE IF NOT EXISTS Scouters (
  StudentNumber INTEGER PRIMARY KEY,
  Name TEXT NOT NULL,
  Token TEXT,
  TimeGenerated INTEGER
);

CREATE TABLE IF NOT EXISTS Matches (
  MatchID TEXT PRIMARY KEY,
  Times TEXT
);

CREATE TABLE IF NOT EXISTS TeamToMatch (
  TeamNumber INTEGER NOT NULL,
  MatchID TEXT NOT NULL,
  Alliance TEXT NOT NULL,
  TeamIndex INTEGER NOT NULL,
  MatchData TEXT,
  ScoutedTime INTEGER,
  PRIMARY KEY (MatchID, Alliance, TeamIndex),
  FOREIGN KEY (TeamNumber) REFERENCES Teams(TeamNumber),
  FOREIGN KEY (MatchID) REFERENCES Matches(MatchID)
);

CREATE TABLE IF NOT EXISTS ScouterToMatch (
  StudentNumber INTEGER NOT NULL,
  MatchID TEXT NOT NULL,
  Alliance TEXT,
  TeamIndex INTEGER,
  PRIMARY KEY (StudentNumber, MatchID),
  FOREIGN KEY (StudentNumber) REFERENCES Scouters(StudentNumber),
  FOREIGN KEY (MatchID) REFERENCES Matches(MatchID)
);



