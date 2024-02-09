CREATE DATABASE anime_list_1
GO

USE anime_list_1
GO 

CREATE TABLE producers
(
    id int not null IDENTITY(1,1) PRIMARY KEY,
    name varchar(100)
) 

CREATE TABLE studios 
(
    id int not null IDENTITY(1,1) PRIMARY KEY,
    name varchar(100)
)

CREATE TABLE anime_studio
(
    id int not null IDENTITY(1,1) PRIMARY KEY,
    stid int,
    aid int
)

CREATE TABLE genres 
(
    id int not null IDENTITY(1,1) PRIMARY KEY,
    name varchar(100)
)

CREATE TABLE anime_genre
(
    id int not null IDENTITY(1,1) PRIMARY KEY,
    gid int,
    aid int 
)

CREATE TABLE voice_actors 
(
    id int not null IDENTITY(1,1) PRIMARY KEY,
    name varchar(50),
	image varchar(100)
   
)

CREATE TABLE characters
(
    id int not null IDENTITY(1,1) PRIMARY KEY,
    name varchar(50),
    vaid int FOREIGN KEY (vaid) REFERENCES Voice_Actors(ID),
	image varchar(100)
)

CREATE TABLE anime_character
(
    id int not null IDENTITY(1,1) PRIMARY KEY,
    chid int,
    aid int
)

CREATE TABLE emotions
(
    id int not null IDENTITY(1,1) PRIMARY KEY,
    name varchar(10)
)

CREATE TABLE anime_emotion
(
    id int not null IDENTITY(1,1) PRIMARY KEY,
    aid int,
    eid int
)


CREATE TABLE animes 
(
    id int not null IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100),
    episodes INT,
    aired DATE,
    pid int FOREIGN KEY (pid) REFERENCES producers(id),
    rating INT,
    synopsis varchar(100),
	image varchar(100)
)

ALTER TABLE anime_studio ADD FOREIGN KEY (aid) REFERENCES animes(id)
ALTER TABLE anime_studio ADD FOREIGN KEY (stid) REFERENCES studios(id)
ALTER TABLE anime_genre ADD FOREIGN KEY (aid) REFERENCES animes(id)
ALTER TABLE anime_genre ADD FOREIGN KEY (gid) REFERENCES genres(id)
ALTER TABLE anime_character ADD FOREIGN KEY (chid) REFERENCES characters(id)
ALTER TABLE anime_character ADD FOREIGN KEY (aid) REFERENCES animes(id)
ALTER TABLE anime_emotion ADD FOREIGN KEY (aid) REFERENCES animes(id)
ALTER TABLE anime_emotion ADD FOREIGN KEY (eid) REFERENCES emotions(id)




