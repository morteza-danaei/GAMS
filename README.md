# General Asset Management System (GAMS)

## Overview
GAMS is a microservices-based application designed for managing organizational assets efficiently. It provides services like user authentication, asset tracking, and administrative tools in a scalable and modular architecture.

## Features
- **Microservices Architecture**: Independent services for better scalability and maintainability.
- **Authentication and Authorization**: Secure user management with JWT-based authentication.
- **Asset Management**: CRUD operations for assets and real-time updates.
- **API Documentation**: Integrated Swagger for easy API exploration and testing.

## Project Structure
root/ │ ├── auth/ # Authentication microservice ├── utility/ # Shared npm module for common functionalities ├── personnel/ # Personnel microservice ├── role/ # role microservice├── infra/k8s/ # Kubernetes configuration files └── README.md # Documentation file


## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **API Documentation**: Swagger

## Prerequisites
- Node.js (v16+)
- MongoDB (v5+)
- Docker (v20+)
- Kubernetes (v1.25+)

## Installation and Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/morteza-danaei/GAMS.git
   cd GAMS
Install dependencies for all microservices:
npm install
cd auth && npm install
cd ../utility && npm install
cd ../personnel && npm install
cd ../role && npm install
# Repeat for other services
Set up environment variables: Create .env files in each microservice folder with the following:
JWT_KEY: Secret key for JWT signing.
MONGO_URI: MongoDB connection string.
Start the services locally:
npm start
Deployment
This project is set up for deployment using GitHub Actions and Kubernetes. Ensure your Kubernetes cluster is running and configured.

Steps
Configure a Kubernetes cluster using your cloud provider.
Update Kubernetes manifests in the kubernetes/ folder with the correct values.
Push changes to GitHub and monitor GitHub Actions for deployment progress.
Testing the Application
Use Postman or Swagger at http://<HOST>:3000/api-docs to test APIs.
Run tests:
npm test
Contributing
Contributions are welcome! Please follow the contributing guidelines.

License
This project is licensed under the MIT License. See the LICENSE file for details.

For more details, visit the GitHub repository.


### Notes:
- Adjust the content to reflect specific details about your project setup, particularly the services and functionality.
- Include more usage instructions for key features.
- Make sure you update `.env` examples based on actual requirements.

If you'd like more help refining this README or adding other sections, let me know!
