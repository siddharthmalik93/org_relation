# Org-relations

## Installation Guide

### Node Package Manager installation

- Install node package manager from the link: https://nodejs.org/en/
- You can upgrade (if required) after the installation using: `npm install npm@latest -g`

### DB setup

- set following the system environment variables in your local machine:
  ```
  DB_HOST = "localhost"
  DB_PORT = 5432
  DB_USER = "postgres"
  DB_PASSWORD = "postgres"
  DB_NAME =  "demo"
  ```

### Clone, Build and Run

- Run the below steps in the command line (powershell as an admin). Below is based on above folder as an example
- cd <YOUR_PROJECT_ROOT>
- Clone using: `git clone https://github.com/siddharthmalik93/org_relation.git`
- `cd org_relation`
- to install: `npm install`
- to start the application: `npm run start`

### POSTMAN API collection

- Import API collection on POSTMAN app using: `https://www.getpostman.com/collections/9daad7fb12d5ed478e5e`

## Scripts

### NPM scripts

`npm start`

Starts the application
