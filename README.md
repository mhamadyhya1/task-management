<h1 align="center" id="title">task managment</h1>

<p id="description">basic task management backend project built using expressJS and typescript</p>

  
  
<h2>🧐 Features</h2>

Here're some of the project's best features:

*   Crud Task Management
*   Swagger for API Documentation
*   Api Audit log files integrated
*   rate limit for apis
*   Uni tests using jest and supertest

<h2>🛠️ Installation Steps:</h2>

<p>1. clone</p>

```
git clone https://github.com/mhamadyhya1/task-management.git
```

<p>2. Install Packages</p>

```
yarn install
```

<p>3. Run Project in Dev Mode</p>

```
yarn run dev
```

<p>4. Start Project in production mode</p>

```
yarn run start:build
```

<p>5. Run project As Dockerized container</p>

```
yarn run docker:compose
```

<p>6. swagger route</p>

```
localhost:PORT/v1/docs
```
<p>7. Run Tests</p>

```
yarn run test
```
<h2>💻 Built with</h2>

Technologies used in the project:

*   ExpressJS
*   Mongodb As Database
*   Dockerized
*   Typescript
*   Redis for caching is also implemented in docker compose as service
*   joi for data validation