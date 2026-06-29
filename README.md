# WhyBuilder

Decision infrastructure for housing in Nairobi.

## What It Does

Finding a home in Nairobi should be straightforward. It should not feel like a gamble.

Most property platforms show you price, bedrooms, and photos. They do not answer the questions that actually matter:
- Is this area safe?
- Will I sleep well here?
- Is this landlord real?

WhyBuilder answers these questions. Every property listing carries safety scores, noise ratings, commute data, and landlord trust scores. No guesses. No assumptions. Just clear numbers.

## Architecture

whybuilder/
├── properties/ Django property management
├── users/ User authentication and profiles
├── landlords/ Landlord verification and management
├── frontend/ React + TypeScript application
└── whybuilder_api/ Django project configuration

text

## Technologies

- Django 6 with REST Framework
- React 18 with TypeScript
- PostgreSQL
- Tailwind CSS
- JWT authentication

## Features

- Verified property listings with safety scores
- Noise level ratings (Quiet, Moderate, Lively)
- Commute time calculations for Nairobi
- Landlord trust scores
- GPS location capture for properties
- Advanced filtering by lifestyle preferences
- Dark/light theme support

## Getting Started

```bash
# Backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend
cd frontend
npm install
npm run dev
Author
Chingili Ricky

People don't struggle to find housing. They struggle to decide confidently.
