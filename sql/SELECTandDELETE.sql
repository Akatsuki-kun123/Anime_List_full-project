USE anime_list
GO

UPDATE animes
SET image = 'https://cdn.myanimelist.net/images/anime/1908/135431.jpg'
WHERE id = 5399;

SELECT * FROM animes
ORDER BY rating ASC;

SELECT * FROM studios
SELECT * FROM producers Where name='null'
SELECT * FROM genres
SELECT * FROM characters
SELECT * FROM anime_character where aid=3470
SELECT * FROM voice_actors
SELECT * FROM anime_genre where aid=3470
SELECT * FROM anime_producer where aid=4435
SELECT * FROM comments

DELETE FROM animes
DELETE FROM studios
DELETE FROM producers
DELETE FROM genres
DELETE FROM characters
DELETE FROM voice_actors
DELETE FROM anime_character
DELETE FROM anime_genre
DELETE FROM anime_producer

ALTER TABLE animes
ADD FOREIGN KEY (stid) REFERENCES studios(id);

ALTER TABLE anime_producer
DROP CONSTRAINT FK__anime_stud__stid__4D94879B;

ALTER TABLE anime_producer
ADD FOREIGN KEY (pid) REFERENCES producers(id);

ALTER TABLE comments
ADD FOREIGN KEY (aid) REFERENCES animes(id);

ALTER TABLE animes
DROP CONSTRAINT FK__animes__comment___18EBB532

ALTER TABLE animes
DROP Column comment_id

ALTER TABLE comments
ADD aid int


SELECT TOP 5 PERCENT [animes].[id], [animes].[name], [animes].[title], [animes].[image], [animes].[episodes], [animes].[aired], [animes].[rating], [animes].[synopsis], 
	   [producers].[id] AS [producers.id], [producers].[name] AS [producers.name], 
	   [studio].[id] AS [studio.id], [studio].[name] AS [studio.name], 
	   [genres].[id] AS [genres.id], [genres].[name] AS [genres.name], 
	   [characters].[id] AS [characters.id], [characters].[name] AS [characters.name], [characters].[image] AS [characters.image], 
	   [characters->voice_actor].[id] AS [characters.voice_actor.id], [characters->voice_actor].[name] AS [characters.voice_actor.name], [characters->voice_actor].[image] AS [characters.voice_actor.image], 
	   [comments].[id] AS [comments.id], [comments].[user_name] AS [comments.user_name], [comments].[comment] AS [comments.comment] FROM [animes] AS [animes] 

LEFT OUTER JOIN ( [anime_producer] AS [producers->anime_producer] INNER JOIN [producers] AS [producers] ON [producers].[id] = [producers->anime_producer].[pid]) 
ON [animes].[id] = [producers->anime_producer].[aid] 

LEFT OUTER JOIN [studios] AS [studio] ON [animes].[stid] = [studio].[id] 

LEFT OUTER JOIN ( [anime_genre] AS [genres->anime_genre] INNER JOIN [genres] AS [genres] ON [genres].[id] = [genres->anime_genre].[gid]) 
ON [animes].[id] = [genres->anime_genre].[aid] 

LEFT OUTER JOIN ( [anime_character] AS [characters->anime_character] INNER JOIN [characters] AS [characters] ON [characters].[id] = [characters->anime_character].[chid]) 
ON [animes].[id] = [characters->anime_character].[aid] 

LEFT OUTER JOIN [voice_actors] AS [characters->voice_actor] 
ON [characters].[vaid] = [characters->voice_actor].[id] 

LEFT OUTER JOIN [comments] AS [comments] 
ON [animes].[id] = [comments].[aid]

ORDER BY [animes].[aired] DESC;