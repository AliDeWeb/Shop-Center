<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Shop Center 🎉

Welcome to Shop Center – an open-source e-commerce backend built with NestJS 🚀. This project aims to provide a powerful, scalable, and clean architecture for your online store! 💻🛒

## Features ✨

* Fully customizable 🛠️
* Order management 📦
* Product management 🏷️
* User authentication 🔑
* Cart management 🛍️
* Payment integration 💳
* RESTful API 📡
* Unit tests 🧪
* Docker support 🐳
* And much more! 🌟

## Tech Stack 🛠️

* NestJS (Backend Framework) ⚙️
* MongoDB (Database) 🗄️
* TypeScript (Language) 🖥️
* Docker (Containerization) 🐋

## How to Get Started 🚀

1. Clone this repository:

```bash
  git clone https://github.com/AliDeWeb/Shop-Center.git
```

2. Install dependencies:

```bash
  pnpm install
```

3. Set up your environment variables in .env (check .env.example for reference).

4. Run the development server:

```bash
  pnpm run start:dev
```

5. Visit the API and start building your e-commerce platform! 🌍

## Envs Example 🪝

```ts
  NODE_ENV=development | production

  PORT=3000

  DB_URL="mongodb url"

  JWT_SECRET_KEY=12345678
  JWT_ACCESS_TOKEN_EXPIRES_IN=15m
  JWT_ACCESS_REFRESH_EXPIRES_IN=7d

  BCRYPT_SALT=10
```

* before running e2e tests notice that you can edit `/test/test-utils.ts` file and change the test db uri.
<br/>
* if you set `NODE_ENV=development`, you'll be able to access swagger document in `host/document`.
<br/>
* you can download and import postman doc from `project-rootdir/postman`.
<br/>
* you can run project with `docker-compose up`, before that you must edit envs in `project-rootdir/docker-compose.yaml`.


## Running Tests 🧪

### This project includes both unit tests and integration tests to ensure the reliability and functionality of the application.

To run the tests, use the following command:

```bash
  pnpm run test
```

For e2e tests, you can use:
```bash
  pnpm run test:e2e
```

## Contributing 🤝

### This project is open source and contributions are always welcome! 🙌

If you're excited about creating a great shopping experience and have ideas to improve Shop Center, feel free to fork the repo, open an issue, or submit a pull request! Together, we can make this project even better! 💪


## License 📜
This project is licensed under the MIT License. See the LICENSE file for more details.

---

This version now includes Docker setup instructions and test running details. Let me know if you need any further adjustments!
