/* Replace with your SQL commands */
CREATE TABLE notes(id SERIAL,
		   body character varying,
		   authorId uuid,
		   bugId uuid,
		   createdAt TIMESTAMP DEFAULT now(),
		   updatedAt TIMESTAMP DEFAULT now(),
		   Primary Key (id)
		   );

ALTER TABLE notes ALTER id SET NOT NULL;
ALTER TABLE notes ALTER body SET NOT NULL;
ALTER TABLE notes ALTER authorId SET NOT NULL;
ALTER TABLE notes ALTER bugId SET NOT NULL;
ALTER TABLE notes ALTER createdAt SET NOT NULL;
ALTER TABLE notes ALTER updatedAt SET NOT NULL;
ALTER TABLE notes ADD CONSTRAINT FKn1 FOREIGN KEY (authorId) references users(id)ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE notes ADD CONSTRAINT FKn2 FOREIGN KEY (bugId) references bugs(id)ON DELETE NO ACTION ON UPDATE NO ACTION;
