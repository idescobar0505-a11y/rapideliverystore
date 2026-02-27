from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Tu URL oficial de Render (PostgreSQL)
SQLALCHEMY_DATABASE_URL = "postgresql://mario_admin:GfAndxsDIdo3mBD4zgVV05n3I4WzFrus@dpg-d675lin5r7bs73ba59ig-a.oregon-postgres.render.com/rapi_db?sslmode=require"

# Motor de conexión a la base de datos
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Creador de sesiones para guardar y leer datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para crear las futuras tablas (Usuarios, Órdenes, etc.)
Base = declarative_base()

# Función para usar la base de datos en cada petición
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()