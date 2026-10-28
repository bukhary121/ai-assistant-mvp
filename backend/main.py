"""
AI Assistant MVP - Data Dashboard Backend
FastAPI application for managing and visualizing Saudi Arabian company data
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Import routers
from routers import companies, industries, analytics, dashboard


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    print("Starting AI Assistant Dashboard Backend...")
    yield
    # Shutdown
    print("Shutting down AI Assistant Dashboard Backend...")


app = FastAPI(
    title="Fikra Tech - AI Assistant Dashboard API",
    description="API for managing and visualizing Saudi Arabian company data across medicine, engineering, restaurants, contracting, and sports industries",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(companies.router, prefix="/api/companies", tags=["companies"])
app.include_router(industries.router, prefix="/api/industries", tags=["industries"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])


@app.get("/")
async def root():
    return {
        "message": "Welcome to Fikra Tech AI Assistant Dashboard API",
        "version": "1.0.0",
        "endpoints": {
            "companies": "/api/companies",
            "industries": "/api/industries",
            "analytics": "/api/analytics",
            "dashboard": "/api/dashboard",
        },
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"}
