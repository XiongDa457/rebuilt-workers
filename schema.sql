DROP INDEX IF EXISTS StudentNumberIdx;
DROP INDEX IF EXISTS MatchTeamIdx;

DROP TABLE IF EXISTS Announcements;
DROP TABLE IF EXISTS PartsRequests;

DROP TABLE IF EXISTS TeamToMatch;
DROP TABLE IF EXISTS ScouterToMatch;

DROP TABLE IF EXISTS Teams;
DROP TABLE IF EXISTS Scouters;
DROP TABLE IF EXISTS Matches;

DROP TABLE IF EXISTS ScouterSessions;

CREATE TABLE IF NOT EXISTS Announcements (
  ID TEXT PRIMARY KEY,
  Time INTEGER,
  Message TEXT
);

CREATE TABLE IF NOT EXISTS PartsRequests (
  ID TEXT PRIMARY KEY,
  Time INTEGER,
  Team INTEGER,
  Parts TEXT
);

CREATE TABLE IF NOT EXISTS Scouters (
  StudentNumber INTEGER PRIMARY KEY,
  NameHash BLOB NOT NULL
);

CREATE TABLE IF NOT EXISTS ScouterSessions (
  TokenHash BLOB PRIMARY KEY,
  StudentNumber INTEGER NOT NULL,
  ExpiresAt INTEGER NOT NULL,
  FOREIGN KEY (StudentNumber) REFERENCES Scouters(StudentNumber)
);
CREATE INDEX StudentNumberIdx
ON ScouterSessions (StudentNumber);

CREATE TABLE IF NOT EXISTS Teams (
  TeamNumber INTEGER PRIMARY KEY,
  PitsByScouter INTEGER,
  PitsData TEXT,
  PitsDataTime INTEGER,
  FOREIGN KEY (PitsByScouter) REFERENCES Scouters(StudentNumber)
);

CREATE TABLE IF NOT EXISTS Matches (
  MatchID TEXT PRIMARY KEY,
  Times TEXT
);

CREATE TABLE IF NOT EXISTS TeamToMatch (
  TeamNumber INTEGER,
  MatchID TEXT NOT NULL,
  Alliance TEXT NOT NULL,
  TeamIndex INTEGER NOT NULL,
  MatchData TEXT,
  UserScoutedTime INTEGER,
  ServerScoutedTime INTEGER,
  PRIMARY KEY (MatchID, Alliance, TeamIndex),
  FOREIGN KEY (TeamNumber) REFERENCES Teams(TeamNumber),
  FOREIGN KEY (MatchID) REFERENCES Matches(MatchID)
);

CREATE TABLE IF NOT EXISTS ScouterToMatch (
  StudentNumber INTEGER NOT NULL,
  MatchID TEXT NOT NULL,
  Alliance TEXT NOT NULL,
  TeamIndex INTEGER NOT NULL,
  PRIMARY KEY (StudentNumber, MatchID),
  FOREIGN KEY (StudentNumber) REFERENCES Scouters(StudentNumber),
  FOREIGN KEY (MatchID) REFERENCES Matches(MatchID)
);
CREATE INDEX MatchTeamIdx
ON ScouterToMatch (MatchID, Alliance, TeamIndex);

