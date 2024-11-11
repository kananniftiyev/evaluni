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

# Evaluni: Importing CSV Questions for Exams

Evaluni allows you to create and manage quizzes and exams for university students. One of the features is the ability to import questions from a CSV file. Below is a tutorial on how to prepare your CSV file, import it, and use it in your application.

## How to Format Your CSV File

Your CSV file should contain the questions and their corresponding multiple-choice answers. The correct answer will always be listed first in each row, followed by the incorrect options. You can also include open-ended questions that can be left blank.

### Example CSV File

Here’s an example CSV file containing 10 questions with their respective answers:

```csv
"What is the capital of Japan?","Tokyo","Osaka","Kyoto","Sapporo"
"Which element has the chemical symbol O?","Oxygen","Osmium","Ozone","Opium"
"Who was the first president of the United States?","George Washington","Thomas Jefferson","Abraham Lincoln","John Adams"
"How many continents are there on Earth?","7","6","5","8"
"What is the largest planet in our solar system?","Jupiter","Saturn","Earth","Mars"
"Which animal is known as the king of the jungle?","Lion","Tiger","Elephant","Giraffe"
"Who painted the Mona Lisa?","Leonardo da Vinci","Vincent van Gogh","Pablo Picasso","Claude Monet"
"Which country is the largest by land area?","Russia","Canada","United States","China"
"What is the main ingredient in guacamole?","Avocado","Tomato","Onion","Pepper"
"Which ocean is the largest?","Pacific Ocean","Atlantic Ocean","Indian Ocean","Arctic Ocean"
```

### CSV Structure

- Question: The first column contains the question text.
- Correct Answer: The second column contains the correct answer (always listed first).
- Incorrect Answers: The remaining columns contain the incorrect answer choices.

### Open-ended Questions

You can also add open-ended questions by leaving the answer options blank. For example:

```csv
"What is your favorite book and why?","Open-ended answer."
```

In the case of open-ended questions, the second column can contain instructions like "Open-ended answer.", which will be handled appropriately by the system.

### Example files

You can find examples of csv files in the [csv](csv/) folder.
