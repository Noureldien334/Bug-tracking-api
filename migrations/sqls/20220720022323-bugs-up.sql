/* Replace with your SQL commands */
CREATE TYPE "bug_prio" AS ENUM ('low','medium','high');

CREATE TABLE bugs(id UUID DEFAULT uuid_generate_v4(),
		  title varchar(40),
		  description character varying,
		  priority bug_prio DEFAULT 'low',
		  projectId UUID,
		  isResolved boolean DEFAULT false,
		  closedById UUID ,
		  closedAt TIMESTAMP,
		  reopenedById UUID,
		  reopenedAt TIMESTAMP,
		  createdById UUID,
		  createdAt TIMESTAMP DEFAULT now(),
		  updatedById UUID,
		  updatedAt TIMESTAMP,
		  Primary Key (id)
		  );

ALTER TABLE bugs ALTER id SET NOT NULL;
ALTER TABLE bugs ALTER title SET NOT NULL;
ALTER TABLE bugs ALTER description SET NOT NULL;
ALTER TABLE bugs ALTER priority SET NOT NULL;
ALTER TABLE bugs ALTER projectId SET NOT NULL;
ALTER TABLE bugs ALTER isResolved SET NOT NULL;
ALTER TABLE bugs ALTER createdById SET NOT NULL;
ALTER TABLE bugs ALTER createdAt SET NOT NULL;
ALTER TABLE bugs ADD CONSTRAINT FKb1 FOREIGN KEY (projectId) references projects(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE bugs ADD CONSTRAINT FKb2 FOREIGN KEY (closedById) references users(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE bugs ADD CONSTRAINT FKb3 FOREIGN KEY (reopenedById) references users(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE bugs ADD CONSTRAINT FKb4 FOREIGN KEY (updatedById) references users(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE bugs ADD CONSTRAINT FKb5 FOREIGN KEY (createdById) references users(id) ON DELETE NO ACTION ON UPDATE NO ACTION;


