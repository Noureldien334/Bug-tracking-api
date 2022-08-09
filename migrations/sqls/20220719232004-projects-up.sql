/* Replace with your SQL commands */
create table projects(id uuid DEFAULT uuid_generate_v4(),
		      createdAt TIMESTAMP DEFAULT now(),
		      updatedAt TIMESTAMP DEFAULT now(),
		      name varchar(40),
		      createdById uuid,
		      Primary Key (id)
		      );
ALTER TABLE projects ALTER id SET NOT NULL;
ALTER TABLE projects ALTER createdAt SET NOT NULL;
ALTER TABLE projects ALTER updatedAt SET NOT NULL;
ALTER TABLE projects ALTER name SET NOT NULL;
ALTER TABLE projects ALTER createdById SET NOT NULL;
ALTER TABLE projects ADD CONSTRAINT FKp1 FOREIGN KEY (createdById) references users(id)ON DELETE NO ACTION ON UPDATE NO ACTION ; 
