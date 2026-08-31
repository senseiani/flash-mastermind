# FlashGenius — AI Flashcard & Quiz Generator

## Overview

FlashGenius is an AI-powered study web application that converts a student's study notes into interactive flashcards and a multiple-choice quiz.

## Features

- Generate exactly 10 AI-powered flashcards from study notes
- Generate exactly 5 multiple-choice questions
- Four answer options (A, B, C, D) for every question
- Easy, Medium, and Hard quiz difficulty levels
- Interactive 3D flashcard flipping
- Instant correct/incorrect quiz feedback
- Final quiz score and percentage
- Notes-only AI generation
- Structured JSON response validation
- Error handling for invalid AI responses
- Responsive dark-mode interface

## How It Works

1. The user pastes their study notes.
2. The notes are sent to the AI generation system.
3. The AI returns structured flashcard and quiz data.
4. The application validates the returned JSON.
5. Exactly 10 flashcards and 5 quiz questions are displayed.
6. The user studies the flashcards and completes the quiz.
7. The application provides instant feedback and a final score.

## AI Reliability

The generation prompt instructs the AI to use only information present in the user's notes and not add outside information.

The application also validates the structure and required counts of the AI response before displaying the generated content.

## Testing

The application was tested with:

- OS — CPU Scheduling
- DBMS — Normalization
- OOP — Polymorphism

Each test was checked for flashcard generation, quiz generation, interaction, and scoring.

## Live Demo

https://flash-mastermind.lovable.app

## Project Status

Completed and deployed as a portfolio project.
