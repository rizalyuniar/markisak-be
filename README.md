<br />
<p align="center">
  <div align="center">
    <img height="150" src="./docs/readme/logo.png" alt="markisak" border="0"/>
  </div>
  <h3 align="center">Markisak (Recipe App)</h3>
  <p align="center">
    <a href="https://github.com/rizalyuniar/markisak-be"><strong>Explore the docs »</strong></a>
    <br />
    <a href="https://markisak-fe.vercel.app">View Demo</a>
    ·
    <a href="https://markisak-be-production-ddec.up.railway.app">Api Demo</a>
  </p>
</p>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Installation](#installation)
  - [Documentation](#documentation)
  - [Related Project](#related-project)
- [Contributors](#contributors)
  - [Meet The Team Members](#meet-the-team-members)

# About The Project

Markisak is a food recipe website project that aims to inspire users to cook and share their favorite recipes. The name Markisak means "let's cook" in Indonesian. On this website, users can search for recipes, share their own recipes, and connect with other food enthusiasts.

One of Markisak's main features is its user-friendly search function. Users can search for recipes by food name. The website also provides detailed recipe instructions, ingredient lists, and video tutorials to assist users in the cooking process.

Another unique feature of Markisak is that users can create their own profiles, connect with other users, and share their favorite recipes. This allows users to learn from each other and explore new culinary ideas.

To use the Markisak website, users simply need to create an account and start searching or sharing recipes. The site is designed to be easy to use and accessible to all levels of culinary expertise

## Built With

These are the libraries and service used for building this backend API

- [Node.js](https://nodejs.org)
- [Express](https://expressjs.com)
- [PostgreSQL](https://www.postgresql.org)
- [Json Web Token](https://jwt.io)
- [Multer](https://github.com/expressjs/multer)
- [Google Cloud Platform](https://cloud.google.com)

# Installation

Follow this steps to run the server locally :

1. Clone this repository

```sh
git clone https://github.com/rizalyuniar/markisak-be
```

2. Change directory to markisak-be

```sh
cd markisak-be
```

3. Install all of the required modules

```sh
npm install
```

4. Create PostgreSQL database, query are provided in [markisak-database-query.sql](./docs/markisak-database-query.sql)

5. Create and configure `.env` file in the root directory, example credentials are provided in [.env.example](./.env.example)

```txt
- Please note that this server requires Google Drive API credentials and Gmail service account
- Otherwise API endpoint with image upload and account register won't work properly
```

6. Run this command to run the server

```sh
npm run server
```

- Or run this command for running in development environment

```sh
npm run dev
```

- Run this command for debugging and finding errors

```sh
npm run lint
```

## Documentation

Documentation files are provided in the [docs](./docs) folder

- [Postman API colletion](./docs/Markisak-be.postman_collection.json)
- [PostgreSQL database query](./docs/markisak-database-query.sql)
- [Database diagram](./docs/markisak-database-diagram.png)

API endpoint list are also available as published postman documentation

[![Run in Postman](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/26309865/2s93XsYSGG)

## Related Project

:rocket: [`Backend Markisak`](https://github.com/rizalyuniar/markisak-be)

:rocket: [`Frontend Markisak`](https://github.com/rizalyuniar/markisak-fe)

:rocket: [`Demo Markisak`](https://markisak-fe.vercel.app/)

# Contributors

This backend API is created by 3 backend team members, where each member have different tasks

[@alifankebima (Alif Anke Bima Putra)](https://github.com/alifankebima) :

- Relational database design
- Recipes CRUD
- Videos CRUD
- Liked Recipes CRUD
- Saved Recipes CRUD
- Comments CRUD
- Postman API documentation

[@ikkair (Ikhlasul Kamal Irmansyah)](https://github.com/ikkair) :

- Team leader
- Users CRUD
- Authentication
- Email verification implementation
- Json web token implementation
- Multer implementation
- Backend deployment

[@andkvnt (Andiko Oktavianto)](https://github.com/andkvnt) :

- Project initialization
- Admin CRUD
- Chats CRUD
- Testing
- Recipe dummy data

## Meet The Team Members

<center>
  <table align="center">
    <tr >
      <th >Backend Developer / Project Manager</th>
      <th >Backend Developer</th>
      <th >Backend Developer</th>
      <th >Frontend Developer</th>
      <th >Frontend Developer</th>
      <th >Frontend Developer</th>
    </tr>
    <tr >
      <td align="center">
        <a href="https://github.com/ikkair">
          <img width="200"  src="./docs/readme/kamal.jpg" alt="Ikhlasul Kamal Irmansyah"><br/>
          <b>Ikhlasul Kamal Irmansyah</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/alifankebima">
          <img width="200"  src="./docs/readme/alif.jpg" alt="Alif Anke Bima Putra"><br/>
          <b>Alif Anke Bima Putra</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/andkvnt">
          <img width="200"  src="./docs/readme/andhiko.jpg" alt="Andiko Oktavianto"><br/>
          <b>Andiko Oktavianto</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/mhmdiamd">
          <img width="200"   src="./docs/readme/ilham.jpg" alt="Muhamad Ilham Darmawan"><br/>
          <b>Muhamad Ilham Darmawan</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/Dhimasswara">
          <img width="200"  src="./docs/readme/dhimas.jpg" alt="Dhimas Pandu Yogaswara"><br/>
          <b>Dhimas Pandu Yogaswara</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/rizalyuniar">
          <img width="200"  src="./docs/readme/rizal.jpg" alt="R. Rizal Yuniar S."><br/>
          <b>R. Rizal Yuniar S.</b>
        </a>
      </td>
    </tr>
  </table>
</center>

Project link : [https://github.com/rizalyuniar/markisak-be](https://github.com/rizalyuniar/markisak-be)
