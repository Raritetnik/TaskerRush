# TaskerRush - Spring Boot (Final Project)

## Overview

Проект TaskerRush — это веб-платформа для управления проектами и задачами, предназначенная для организации рабочего процесса как отдельных пользователей, так и небольших команд.

Пользователь может зарегистрировать новый аккаунт, после чего выполнить вход в систему, используя свои учетные данные. После успешной авторизации ему становится доступен личный рабочий кабинет.

Основной функционал платформы включает:

Регистрация и авторизация пользователей с безопасным хранением паролей и системой аутентификации.
Создание проектов, позволяющее разделять задачи по различным направлениям работы.
Управление проектами, включая просмотр списка проектов и выбор активного проекта.
Создание задач внутри каждого проекта с указанием названия, описания, приоритета и текущего статуса.
Изменение статуса задач (например: To Do, In Progress, Done), что позволяет отслеживать ход выполнения работы.
Редактирование и удаление задач для поддержания актуальности информации.
Безопасный доступ к данным, при котором каждый пользователь имеет доступ только к собственным проектам и задачам.

## Features

* Spring Boot 4.1
* Java 21
* RESTful API
* JWT (JSON Web Token) authentication (API requests)
* Database integration
* Docker
* User authentication and authorization
* Basic user management controllers

## Technologies

* Java 21
* Spring Boot 4.1
* Spring Security (Session on pages access)
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
3. Build and Run the project with Docker Composer:

```bash
docker composer up --build
```

## Author

Created by Mykhaylo Kuzmin
