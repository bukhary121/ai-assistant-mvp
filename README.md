# Fikra Tech AI Assistant Dashboard

## Overview

A comprehensive **Data Dashboard** for **Fikra Tech Establishment** that collects, analyzes, and visualizes data about Saudi Arabian companies across multiple industries:

- **Medicine** (Hospitals, Clinics, Pharmacies, Medical Labs)
- **Engineering** (Civil, Mechanical, Electrical)
- **Contracting** (General, Specialized)
- **Restaurants** (Fine Dining, Cafes, Fast Food)
- **Sports** (Gyms, Sports Halls, Sports Clubs)

## Features

### Backend (FastAPI)
- **RESTful API** with comprehensive endpoints
- **SQLAlchemy ORM** for database management
- **Industry-specific models** for each sector
- **Advanced analytics** and insights
- **Data visualization** endpoints for dashboard widgets

### Frontend (React + TypeScript)
- **Interactive Dashboard** with charts and statistics
- **Company Management** (CRUD operations)
- **Industry Analysis** pages
- **Market Opportunities** identification
- **Competitive Analysis** tools
- **Responsive Design** with RTL (Arabic) support

## Tech Stack

### Backend
- Python 3.9+
- FastAPI
- SQLAlchemy
- Pydantic (Data Validation)
- SQLite (Default, can be changed to PostgreSQL)
- Uvicorn (ASGI Server)

### Frontend
- React 18+
- TypeScript
- Material-UI (MUI)
- Chart.js (Data Visualization)
- React Query (Data Fetching)
- React Router (Navigation)

## Project Structure

```
fikratech-ai-assistant/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   ├── database/
│   │   └── database.py        # Database configuration
│   ├── models/
│   │   └── company.py         # Data models
│   ├── schemas/
│   │   └── company.py         # Pydantic schemas
│   ├── routers/
│   │   ├── companies.py       # Company endpoints
│   │   ├── industries.py       # Industry endpoints
│   │   ├── analytics.py        # Analytics endpoints
│   │   └── dashboard.py        # Dashboard endpoints
│   └── utils/
│       └── seed_data.py        # Sample data seeding
│
└── frontend/
    ├── public/
    │   └── index.html          # HTML template
    ├── src/
    │   ├── index.tsx           # React entry point
    │   ├── App.tsx              # Main application
    │   ├── components/          # Reusable components
    │   ├── pages/               # Page components
    │   ├── hooks/               # Custom hooks
    │   ├── types/               # TypeScript types
    │   ├── utils/               # Utilities
    │   └── styles/              # CSS styles
    └── package.json            # Node dependencies
```

## Setup and Installation

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize database:**
   ```bash
   python -c "from database.database import Base, engine; Base.metadata.create_all(bind=engine); print('Database created')"
   ```

5. **Seed sample data (optional):**
   ```bash
   python -c "from database.database import SessionLocal; from utils.seed_data import seed_database; db = SessionLocal(); seed_database(db); db.close()"
   ```

6. **Run the server:**
   ```bash
   uvicorn main:app --reload
   ```

   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```env
   REACT_APP_API_URL=http://localhost:8000/api
   ```

4. **Run the development server:**
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## API Documentation

The backend provides the following main endpoints:

### Base URL
```
http://localhost:8000/api
```

### Dashboard Endpoints
- `GET /dashboard/summary` - Get dashboard summary
- `GET /dashboard/kpis` - Get key performance indicators
- `GET /dashboard/widgets/industry-breakdown` - Industry distribution chart data
- `GET /dashboard/widgets/regional-distribution` - Regional distribution chart data
- `GET /dashboard/widgets/technology-adoption` - Technology adoption chart data
- `GET /dashboard/widgets/company-size-distribution` - Company size distribution chart data
- `GET /dashboard/widgets/verification-status` - Verification status chart data
- `GET /dashboard/widgets/top-companies` - Top companies data
- `GET /dashboard/widgets/recent-verifications` - Recently verified companies
- `GET /dashboard/widgets/industry-specific` - Industry-specific widget data

### Companies Endpoints
- `GET /companies/` - List all companies (with filtering)
- `POST /companies/` - Create a new company
- `GET /companies/{id}` - Get a specific company
- `PUT /companies/{id}` - Update a company
- `DELETE /companies/{id}` - Delete a company
- `POST /companies/{id}/contacts` - Add contact to company
- `GET /companies/{id}/contacts` - List company contacts
- `GET /companies/{id}/projects` - List company projects
- `POST /companies/{id}/projects` - Add project to company

### Industries Endpoints
- `GET /industries/` - List all industries
- `POST /industries/` - Create a new industry
- `GET /industries/{id}` - Get a specific industry
- `PUT /industries/{id}` - Update an industry
- `DELETE /industries/{id}` - Delete an industry
- `POST /industries/medicine/{company_id}` - Add medicine-specific data
- `GET /industries/medicine/{company_id}` - Get medicine-specific data
- `POST /industries/engineering/{company_id}` - Add engineering-specific data
- `GET /industries/engineering/{company_id}` - Get engineering-specific data
- `POST /industries/contracting/{company_id}` - Add contracting-specific data
- `GET /industries/contracting/{company_id}` - Get contracting-specific data
- `POST /industries/restaurants/{company_id}` - Add restaurant-specific data
- `GET /industries/restaurants/{company_id}` - Get restaurant-specific data
- `POST /industries/sports/{company_id}` - Add sports-specific data
- `GET /industries/sports/{company_id}` - Get sports-specific data
- `GET /industries/statistics` - Get industry statistics

### Analytics Endpoints
- `GET /analytics/overview` - Get analytics overview
- `GET /analytics/industry-analysis` - Get industry analysis
- `GET /analytics/market-opportunities` - Get market opportunities
- `GET /analytics/competitive-analysis` - Get competitive analysis
- `GET /analytics/company-analytics/{company_id}` - Get company-specific analytics

## Usage

### Adding a New Company

```bash
curl -X POST "http://localhost:8000/api/companies/" \
  -H "Content-Type: application/json" \
  -d '{
    "name_ar": "شركتي الجديدة",
    "name_en": "My New Company",
    "industry_id": 1,
    "city": "الرياض",
    "region": "الرياض",
    "company_size": "medium",
    "company_type": "llc",
    "ownership": "saudi"
  }'
```

### Getting Dashboard Summary

```bash
curl "http://localhost:8000/api/dashboard/summary"
```

## Dashboard Features

### Main Dashboard
- **Quick Statistics**: Total companies, verified companies, total revenue, total employees
- **Industry Distribution**: Pie chart showing companies by industry
- **Regional Distribution**: Bar chart showing companies by region
- **Technology Adoption**: Bar chart showing technology adoption rates
- **Company Size Distribution**: Doughnut chart showing companies by size
- **Top Companies**: List of top companies by revenue
- **Recent Activity**: List of recently verified companies

### Companies Page
- **Filtering**: Filter companies by industry, region, city, size, verification status
- **Search**: Search companies by name
- **CRUD Operations**: Create, Read, Update, Delete companies
- **Pagination**: Navigate through large datasets

### Company Detail Page
- **Overview Tab**: Basic company information, location, financials
- **Contact Tab**: Contact information, social media, technology adoption
- **Analytics Tab**: Company analytics, comparisons, challenges
- **History Tab**: Company history, verification details

### Analytics Pages
- **Overview**: Comprehensive analytics overview with charts
- **Industry Analysis**: Detailed analysis of each industry
- **Market Opportunities**: Identify high-potential segments and opportunities
- **Competitive Analysis**: Analyze competition between companies

## Industry-Specific Features

### Medicine Companies
- Specializations (Cardiology, Neurology, etc.)
- Certifications (MOH Approval, ISO, JCI)
- Services (Telemedicine, Home Care, Emergency)
- Technology (EHR, Lab Management, Radiology, PACS)
- Patient statistics (Bed Capacity, Annual Volume, Satisfaction)

### Engineering Companies
- Engineering Disciplines
- Certifications (Saudi Council License, ISO 9001, OHSAS 18001)
- Services (Design, Consulting, Supervision, Project Management)
- Software Tools (AutoCAD, Revit, BIM)
- Project Portfolio (Completed, Ongoing)

### Contracting Companies
- Classification and Grade
- Certifications (Contractors Classification, Saudi Contractors Authority)
- Capabilities (Max Project Value, Government Projects)
- Equipment (Owned Equipment List)
- Safety (Safety Rating, Certifications)

### Restaurant Companies
- Cuisine Types
- Certifications (Food Safety, Halal)
- Operations (Delivery, Takeaway, Reservations, Catering)
- Technology (POS, Online Ordering, Inventory Management)
- Capacity (Seating, Daily Customers)
- Ratings (Food, Service, Cleanliness)
- Menu (Digital Menu, Items Count, Price Range)

### Sports Companies
- Sports Types
- Facility Type (Gym, Stadium, Club)
- Certifications (Sports Authority, International Standards)
- Facilities (Gym, Swimming Pool, Sports Hall, Outdoor Fields)
- Membership (Count, Fee Range)
- Technology (Member Management, Booking, Fitness Tracking)
- Events (Hosting, Events per Year)

## Customization

### Adding New Industry
1. Add industry to `backend/models/company.py`
2. Add corresponding schema in `backend/schemas/company.py`
3. Add router endpoints in `backend/routers/industries.py`
4. Add frontend types in `frontend/src/types/index.ts`
5. Add frontend pages/components as needed

### Changing Database
To change from SQLite to PostgreSQL:

1. Update `backend/database/database.py`:
```python
SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost/fikratech"
```

2. Install PostgreSQL driver:
```bash
pip install psycopg2-binary
```

## Deployment

### Docker (Recommended)

Create a `Dockerfile` for backend:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Create a `Dockerfile` for frontend:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
CMD ["npx", "serve", "-s", "build"]
```

### Production Build

1. Build frontend:
```bash
cd frontend
npm run build
```

2. Serve frontend with Nginx or any static file server

3. Run backend with production settings:
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## License

MIT License - Copyright (c) 2026 Fikra Tech Establishment

## Support

For support and inquiries, please contact:
- Email: info@fikratech.com
- Website: https://www.fikratech.com

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests.

## Acknowledgments

- FastAPI for the excellent backend framework
- React for the powerful frontend library
- Material-UI for the beautiful components
- Chart.js for the data visualization
