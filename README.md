# Spring Boot JWT Authentication API

## Overview

This project is a REST API built with **Spring Boot 4.1** and **Java 21**. It demonstrates a basic backend architecture with JWT authentication, database integration, and user management endpoints.

## Features

* Spring Boot 4.1
* Java 21
* RESTful API
* JWT (JSON Web Token) authentication
* Database integration
* User authentication and authorization
* Basic user management controllers

## Technologies

* Java 21
* Spring Boot 4.1
* Spring Security
* Spring Data JPA
* JWT
* Maven

## Project Setup

### Requirements

* Java 21
* Maven 3.9+
* A supported relational database

### Installation

1. Clone the repository.
2. Configure the database connection in `application.properties`.
3. Build the project:

```bash
mvn clean install
```

4. Run the application:

```bash
mvn spring-boot:run
```

## Implemented Functionality

### Database

* Created project database
* Created user table
* Configured JPA entity and repository

### Authentication

* User login endpoint
* Username/password validation
* JWT token generation
* JWT token validation for protected endpoints
* Stateless authentication using Spring Security

### REST Controllers

Basic user interaction endpoints have been implemented, including:

* User authentication
* Protected API endpoints
* User-related operations

## Future Improvements

* User registration
* Refresh tokens
* Role-based authorization
* Password encryption migration (if required)
* Exception handling
* API documentation with OpenAPI/Swagger
* Unit and integration tests

## Author

Created as a learning project using Spring Boot 4.1 and Java 21.
