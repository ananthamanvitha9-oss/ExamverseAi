# Examverse AI - Database Design Document

## 1. Overview
This document outlines the relational structure of the MySQL database powering the platform.

## 2. Core Tables
### Users Table
- `id` (PK)
- `name`
- `email`
- `password`
- `role` (student, admin)

### Courses Table
- `id` (PK)
- `title`
- `description`
- `price`

*(Further schemas for Subjects, Chapters, Lessons, Mock Tests, and Subscriptions will be designed during their respective Sprints).*
