# Evaluni

Evaluni is Exam and Quiz management App for University Students and Lecturers🎯📊.

# Features

- Creating Tests.
- Student analysis for tests.

# Pages

- [x] Home Page
- [x] Login Page
- [x] Register Page
- [x] Exam List Page
- [x] Exam Details Page
- [x] Create Exam Page
- [x] Exam Results Page
- [x] Leaderboard Page

## Automating with Scripts

For easier setup, there are scripts located in the `bin/` folder to automate the process.

### For Linux and MacOS Users:

Use the `start.sh` script to automatically set up the environment, install dependencies, start the JSON server, and run the app. Simply run the following command in the root directory:

```bash
./bin/start.sh
```

### For Windows Users:

Use the start.bat script to perform the same actions on Windows. Run the following in the project directory:

```bash
bin\start.bat
```

These scripts handle all necessary steps, including starting the JSON server and running the Deno app.

## Getting Started with Evaluni (Deno + React)

Evaluni is an Exam and Quiz management app designed for university students and lecturers. 🎯📊

## Prerequisites

Before you begin, ensure that you have the following tools installed:

- [Deno](https://deno.land/): The runtime for JavaScript and TypeScript.
- [React](https://reactjs.org/): Library for building user interfaces (using JSX syntax, and Deno-compatible tools).

## 1. Set up Deno environment

First, ensure you have Deno installed. You can install it by running:

```bash
curl -fsSL https://deno.land/x/install/install.sh | sh
```

Check if Deno is installed by running:

```bash
deno --version
```

## 2. Install Packages

After entering to project folder make sure to install packages with:

```bash
deno install.
```

## 3. Run Json Server

To start the JSON Server, run the following command in the project root:

```bash
npx json-server --watch db.json
```

## Run App

Now It is ready you can run app with:

```bash
deno task dev
```
