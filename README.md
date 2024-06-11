# ROLOSOFT_WEB_FRONT

# Frisa Charity Soccer Tournaments Management System

## Overview

Welcome to the Frisa Charity Soccer Tournaments Management System! This project aims to manage annual soccer tournaments for 200 kids, organized by [Frisa](https://www.frisa.com/es/welcome). It includes both a web application for administrators and an iOS app for players and parents. 

## Features

### Admin Dashboard
- **Log In**: Autenticate admin users.

<img width="2002" alt="image" src="https://github.com/rolosoft-co-mx/ROLOSOFT_WEB_FRONT/assets/78885738/8a702914-5765-45af-a4e0-aa1958e03e16">

- **User Management**: Create and manage accounts for students and other admins.

<img width="2046" alt="image" src="https://github.com/rolosoft-co-mx/ROLOSOFT_WEB_FRONT/assets/78885738/0d7a58c7-dd1c-4fae-8d7b-7c3316057eaa">

- **School Profiles**: Register, manage and upload pictures to school profiles participating in the tournaments.

<img width="1753" alt="image" src="https://github.com/rolosoft-co-mx/ROLOSOFT_WEB_FRONT/assets/78885738/b5d9a2da-9951-4dd8-9e44-418546ccdfac">

- **Tournaments**: Create and manage yearly tournaments with unique configurations.

<img width="2051" alt="image" src="https://github.com/rolosoft-co-mx/ROLOSOFT_WEB_FRONT/assets/78885738/379ecdb1-3252-4350-80ac-0eb124ab7d6e">

- **Players**: Manage and upload pictures for students and registering green cards. 

- <img width="1741" alt="image" src="https://github.com/rolosoft-co-mx/ROLOSOFT_WEB_FRONT/assets/78885738/9abbe53f-2f39-463f-b75c-264c07bffae1">

- **Teams**: Create, edit, and delete teams by selecting a school and 11 players.

<img width="2037" alt="image" src="https://github.com/rolosoft-co-mx/ROLOSOFT_WEB_FRONT/assets/78885738/f638e635-6af9-4429-a228-336fb121c75e">

- **Matches**: Schedule matches by selecting a phase, two teams, start, and end date. Add goals at the end of the match.

<img width="1746" alt="image" src="https://github.com/rolosoft-co-mx/ROLOSOFT_WEB_FRONT/assets/78885738/1d6c598b-0e10-45cd-bf79-441ab881e260">

- **Statistics**: View score tables with player statistics and general tables with team statistics, including games played, lost, and won.

<img width="1746" alt="image" src="https://github.com/rolosoft-co-mx/ROLOSOFT_WEB_FRONT/assets/78885738/9a5ab027-61ef-48d6-a020-b05354fe88d0">
<img width="1742" alt="image" src="https://github.com/rolosoft-co-mx/ROLOSOFT_WEB_FRONT/assets/78885738/e7a28e9d-4652-4347-b90a-ec452f2a53af">

- **News**: Create and manage news related to the tournament.

<img width="2050" alt="image" src="https://github.com/rolosoft-co-mx/ROLOSOFT_WEB_FRONT/assets/78885738/aacd29df-cd7f-4f40-ba70-09161b25f2b5">


### User Roles
- **Admin**: Full access to manage the entire system.
- **Student/Parents**: View their profiles, match schedules, and team statistics via the iOS app.

## Technologies Used

### Frontend
- **React**: A JavaScript library for building user interfaces.
- **Ant Design**: A design system for enterprise-level products. Used for UI components and styling.
- **TypeScript**: A superset of JavaScript that adds static types.
- **Axios**: A promise-based HTTP client for making API requests.

### Backend
- **Node.js**: A JavaScript runtime for building the backend server.
- **PostgreSQL**: A powerful, open-source object-relational database system.
- **Sequelize**: An ORM for Node.js, making it easy to interact with the database.
- **Postman**: A collaboration platform for API development.

<img width="1400" alt="image" src="https://github.com/rolosoft-co-mx/ROLOSOFT_WEB_FRONT/assets/78885738/9eba3166-2d1e-4488-8e8f-86f754b917ab">


### Hosting
- **Google Cloud Platform (GCP)**: The web application is hosted on GCP, providing scalability and reliability.

### Mobile
- **iOS App**: An application for iOS devices, allowing players and parents to view tournament details, schedules, and statistics.

<img width="801" alt="image" src="https://github.com/rolosoft-co-mx/ROLOSOFT_WEB_FRONT/assets/78885738/efd3f463-a8dd-433d-9cdb-193f6f580309">

## Installation

### Prerequisites
- Node.js (v14.x or higher)
- PostgreSQL
- Google Cloud Platform account

### Backend Setup
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/frisa-charity-tournaments-backend.git
    cd frisa-charity-tournaments-backend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up environment variables:
    Create a `.env` file in the root directory and add the following:
    ```env
    DATABASE_URL=your_postgres_database_url
    JWT_SECRET=your_jwt_secret
    PORT=5000
    ```
4. Run database migrations and seed data:
    ```bash
    npx sequelize-cli db:migrate
    npx sequelize-cli db:seed:all
    ```
5. Start the server:
    ```bash
    npm start
    ```

### Frontend Setup
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/frisa-charity-tournaments-frontend.git
    cd frisa-charity-tournaments-frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up environment variables:
    Create a `.env` file in the root directory and add the following:
    ```env
    REACT_APP_API_URL=your_backend_api_url
    ```
4. Start the development server:
    ```bash
    npm start
    ```

### iOS App Setup
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/frisa-charity-tournaments-ios.git
    cd frisa-charity-tournaments-ios
    ```
2. Open the project in Xcode.
3. Set up environment variables and configurations as needed.
4. Build and run the app on an iOS device or simulator.

## Usage

### Admin Dashboard
1. Log in with admin credentials.
2. Use the sidebar to navigate between different sections: Users, Schools, Tournaments, Teams, Matches, Statistics, and News.
3. Manage entities by using the forms and tables provided in each section.

### Player and Parent App
1. Log in with player or parent credentials.
2. View tournament details, match schedules, team statistics, and news.

## Contribution

We welcome contributions! Please follow these steps to contribute:
1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature/your-feature-name
    ```
3. Make your changes and commit them:
    ```bash
    git commit -m "Add your message here"
    ```
4. Push to the branch:
    ```bash
    git push origin feature/your-feature-name
    ```
5. Create a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any inquiries or support, please contact us at support@frisa-charity.org.

---

Thank you for using the Frisa Charity Soccer Tournaments Management System! We hope it helps you efficiently manage and enjoy your tournaments.
