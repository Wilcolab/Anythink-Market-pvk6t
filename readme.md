# Welcome to the Anythink Market repo

To start the app use Docker. It will start both frontend and backend, including all the relevant dependencies, and the db.

Please find more info about each part in the relevant Readme file ([frontend](frontend/readme.md) and [backend](backend/README.md)).

## Development

When implementing a new feature or fixing a bug, please create a new pull request against `main` from a feature/bug branch and add `@vanessa-cooper` as reviewer.

## First setup

1. If you don't have Docker yet, install using this [link](https://docs.docker.com/get-docker/)
2. To verify if Docker is installed, run the following commands: 
```sh
docker -v

docker-compose -v.
```
3. Run `docker-compose.yml` using `docker-compose u` from the project root directory.
4. Once it has finished installing, check the following links if it they are working properly:
    - http://localhost:3000/api/ping - backend
    - http://localhost:3001/register - frontend
