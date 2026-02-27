from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import database

# Esto crea las tablas en la base de datos si aún no existen
database.Base.metadata.create_all(bind=database.engine)

# Iniciar la aplicación de FastAPI
app = FastAPI(title="Rapi Delivery API")

# IMPORTANTE: Aquí le decimos a Python dónde están tus CSS y JS.
# Montamos la carpeta "static" para que el HTML pueda leer los estilos.
app.mount("/static", StaticFiles(directory="static"), name="static")

# Ruta principal: Cuando alguien entre a tu link, se pinta el index.html
@app.get("/")
async def read_root():
    return FileResponse("index.html")