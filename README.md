# Markisak-be
Markisak-be is a RESTful API backend for interfacing markisak relational database and providing API for markisak frontend,
markisak is a website where users can add and share recipes. 

This repository also serves as a learning exercise at team collaboration and management.

## Teams members
This backend API is created by 3 team members, where each member have different tasks

[@breadsticks64 (Alif Anke Bima Putra)] : 
- Relational database design
- Recipes CRUD
- Videos CRUD
- Liked Recipes CRUD
- Saved Recipes CRUD
- Comments CRUD
- Postman API documentation

[@ikkair (Ikhlasul Kamal Irmansyah)] : 
- Team leader
- Users CRUD
- Authentication
- Email verification implementation
- Json web token implementation
- Multer implementation
- Backend deployment

[@andkvnt (Andiko Oktavianto)] : 
- Project initialization
- Admin CRUD
- Chats CRUD
- Testing
- Recipe dummy data

## Documentation
Documentation files are provided in the [docs] folder
- [Postman API colletion]
- [PostgreSQL database query]
- [Database diagram]

## Installation
Follow this steps to run the server :
1. Clone this repository with `git clone https://github.com/ikkair/markisak-be.git`
2. Change directory to markisak-be with `cd markisak-be`
3. Run `npm install` to install all of the required modules
4. Create PostgreSQL database, query are provided in the [docs] folder
5. Create and configure `.env` file in the root directory, example are provided in `.env.example`
6. Run `npm run server` to run the server, or use `npm run dev` for running in development environment

## Debugging
Run `npm run lint` for debugging errors in this repository

## List of third-party modules
| Modules | Description |
| ------ | ------ |
| [Express] | Backend framework |
| [Nodemon] | Restart server on file change |
| [Morgan] | HTTP request logger |
| [node-postgres] | PostgresSQL interface library |
| [Dotenv] | Load environment variables |
| [CORS] | Enable CORS |
| [ESLint] | Linter for debugging |
| [Http-errors] | Create HTTP errors |
| [Helmet] | Set HTTP headers for security |
| [XSS-Clean] | Sanitize user input |
| [Bcryptjs] | Password encryption and salting |
| [Jsonwebtoken] | Token based user authentication |
| [Multer] | multipart/form-data handling |
| [Path] | Directory and file path handling |
| [UUID] | UUID Generator |

[docs]: <docs>
[Postman API colletion]: <docs/Markisak-be.postman_collection.json>
[PostgreSQL Database Query]: <docs/query.sql>
[Database Diagram]: <docs/markisak-database-diagram.png>
[@breadsticks64 (Alif Anke Bima Putra)]: <https://www.github.com/breadsticks64>
[@ikkair (Ikhlasul Kamal Irmansyah)]: <https://www.github.com/ikkair>
[@andkvnt (Andiko Oktavianto)]: <https://www.github.com/andkvnt>
[express]: <https://expressjs.com>
[Nodemon]: <https://nodemon.io/>
[Morgan]: <https://github.com/expressjs/morgan#readme>
[node-postgres]: <https://node-postgres.com>
[Dotenv]: <https://www.npmjs.com/package/dotenv>
[CORS]: <https://github.com/expressjs/cors#readme>
[ESLint]: <https://eslint.org>
[Http-errors]: <https://www.npmjs.com/package/http-errors>
[Helmet]: <https://helmetjs.github.io/>
[XSS-Clean]: <https://github.com/jsonmaur/xss-clean>
[Bcryptjs]: <https://github.com/dcodeIO/bcrypt.js>
[Jsonwebtoken]: <https://jwt.io/>
[Multer]: <https://github.com/expressjs/multer>
[Path]: <https://github.com/jinder/path>
[UUID]: <https://github.com/uuidjs/uuid>
