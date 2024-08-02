CREATE TABLE todo_premade(
	id SERIAL PRIMARY KEY,
	title VARCHAR(100) NOT NULL,
	description VARCHAR(200),
	day VARCHAR(20)  
);

CREATE TABLE todo_history(
	id SERIAL PRIMARY KEY,
	title VARCHAR(100),
	description VARCHAR(500),
	is_finished BOOLEAN DEFAULT 'false',
	date TIMESTAMP
);

CREATE TYPE category as ENUM ('FRONTEND', 'BACKEND');

CREATE TABLE technology(
	id SERIAL PRIMARY KEY,
	name VARCHAR(45),
	origin_language VARCHAR(45),
	categories category
);

CREATE TABLE note(
	id SERIAL PRIMARY KEY,
	technology_id INTEGER REFERENCES technology(id),
	title VARCHAR(45),
	description VARCHAR(500),
	date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE todo_premade(
	id SERIAL PRIMARY KEY,
	title VARCHAR(100) NOT NULL,
	description VARCHAR(200),
	day VARCHAR(20)  
);

CREATE TABLE todo_history(
	id SERIAL PRIMARY KEY,
	title VARCHAR(100),
	description VARCHAR(500),
	is_finished BOOLEAN DEFAULT 'false',
	date TIMESTAMP
);

CREATE TYPE category as ENUM ('FRONTEND', 'BACKEND');

CREATE TABLE technology(
	id SERIAL PRIMARY KEY,
	name VARCHAR(45),
	origin_language VARCHAR(45),
	categories category
);

CREATE TABLE note(
	id SERIAL PRIMARY KEY,
	technology_id INTEGER REFERENCES technology(id),
	title VARCHAR(45),
	description VARCHAR(500),
	date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

