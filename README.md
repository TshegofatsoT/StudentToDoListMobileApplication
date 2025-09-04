# Student To-do List

A mobile-friendly to-do list app designed for students, especially those studying remotely (e.g., UNISA). This app helps students manage their studies by adding, tracking, and organizing tasks such as assignments and exams.

## Features
- **Add tasks** (e.g., assignments, exams)
- **Mark tasks as done/not done**
- **View tasks in a clean, mobile-friendly GUI**

## Technologies Used

### Backend
- **Node.js** (LTS recommended)
- **Express.js**: Web framework for Node.js
  - Handles routes (`/api/tasks`)
  - Serves static front-end files (`public/`)
- **Mongoose**: ODM for MongoDB
  - Defines Task schema/model
  - Provides easy CRUD operations
- **dotenv**: Loads environment variables from `.env` file
  - Keeps MongoDB URI and PORT configurable

### Frontend (served from `public/`)
- **HTML5**: App structure (inputs, task list)
- **CSS3**: Mobile responsive, simple layout
- **Vanilla JavaScript (ES6)**
  - Fetch API to call backend (`/api/tasks`)
  - Renders tasks dynamically in the UI

## Project Structure
```
student-todo/
├── server.js
├── .env
├── package.json
├── models/
│   └── Task.js
├── routes/
│   └── tasks.js
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
```

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS version, e.g., 20.x)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (e.g., 8.0.13)
- [Visual Studio Code](https://code.visualstudio.com/) (recommended)

### Steps
1. **Clone the repository**
   ```sh
git clone <[https://github.com/TshegofatsoT/StudentToDoListMobileApplication.git>
cd student-todo
```
2. **Install dependencies**
   ```sh
npm install
```
3. **Configure environment variables**
   - Create a `.env` file in the root directory:
     ```env
     MONGODB_URI=mongodb://localhost:27017/student-todo
     PORT=3000
     ```
4. **Start MongoDB**
   - Make sure your MongoDB server is running.
5. **Run the server**
   ```sh
npm start
```
6. **Open the app**
   - Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Usage
- Add a new task using the input field.
- Mark tasks as done/not done by clicking the checkbox.
- View all tasks in a mobile-friendly list.

## Configuration
- **.env** file:
  - `MONGODB_URI`: MongoDB connection string
  - `PORT`: Port for the Express server

## Troubleshooting
- **MongoDB connection errors**: Ensure MongoDB is running and the URI in `.env` is correct.
- **Port in use**: Change the `PORT` value in `.env` if 3000 is already in use.
- **Dependencies not found**: Run `npm install` to install missing packages.

## Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

