/* Replace with your SQL commands */
create table users (id uuid DEFAULT uuid_generate_v4(),
		    createdAt TIMESTAMP DEFAULT now(), 
		    updatedAT TIMESTAMP DEFAULT now(), 
		    username varchar(30),
		    passwordHashed varchar(100),
		    Primary key (id)
		    );
ALTER TABLE users Alter id SET NOT NULL;
ALTER TABLE users Alter createdAt SET NOT NULL;
ALTER TABLE users Alter updatedAt SET NOT NULL;
ALTER TABLE users Alter username SET NOT NULL;
ALTER TABLE users Alter passwordHashed SET NOT NULL;
