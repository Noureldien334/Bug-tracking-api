/* Replace with your SQL commands */
CREATE TABLE members(id SERIAL,
		     projectId UUID,
		     memberId UUID,
		     joinedAt TIMESTAMP DEFAULT now(),
		     Primary Key (id) 
		     );
ALTER TABLE members ALTER id SET NOT NULL;
ALTER TABLE members ALTER projectId SET NOT NULL;
ALTER TABLE members ALTER memberId SET NOT NULL;
ALTER TABLE members ALTER joinedAt SET NOT NULL;
ALTER TABLE members ADD CONSTRAINT FKm1 FOREIGN KEY(projectId) references projects(id) ON DELETE NO ACTION ON UPDATE NO ACTION; 
