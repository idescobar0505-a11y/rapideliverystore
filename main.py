import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
import database

# 1. Crear las tablas en la Base de Datos PostgreSQL (Usa tu V3 de database.py)
database.crear_db()

# 2. Iniciar la App (Este será el Cerebro Maestro)
app = FastAPI(title="Rapi Delivery API Master - V3")

# Habilitar conexiones desde cualquier app (Para que el Rider pueda conectarse aquí)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ================= MODELOS DE DATOS =================
class PedidoNuevo(BaseModel):
    cliente: str
    direccion: str
    tienda: str
    productos: str
    total: float
    telefono: Optional[str] = ""
    referencia: Optional[str] = ""
    lat: Optional[float] = None
    lon: Optional[float] = None

class RechazoRequest(BaseModel):
    pedido_ids: List[int]
    rider_id: str

class EstadoUpdate(BaseModel):
    status: str

# ================= 1. RUTAS PARA PINTAR LA APP DEL CLIENTE =================
# Montamos la carpeta "static" tal como la tienes estructurada en tu proyecto cliente
if os.path.exists("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def serve_index():
    index_path = os.path.join(os.getcwd(), "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"error": "No se encontró el archivo index.html en la raíz"}

# ================= 2. API PARA RECIBIR ÓRDENES DEL CLIENTE =================
@app.post("/api/pedidos")
def crear_pedido(pedido: PedidoNuevo, db: Session = Depends(get_db)):
    nuevo_pedido = database.PedidoDB(
        cliente=pedido.cliente,
        direccion=pedido.direccion,
        tienda=pedido.tienda,
        productos=pedido.productos,
        total=pedido.total,
        telefono=pedido.telefono,
        referencia=pedido.referencia,
        lat=pedido.lat,
        lon=pedido.lon,
        status="pendiente" # Se marca pendiente para el radar de los Riders
    )
    db.add(nuevo_pedido)
    db.commit()
    db.refresh(nuevo_pedido)
    return {"status": "success", "id": nuevo_pedido.id}

# ================= 3. API PARA RASTREO EN VIVO (CLIENTE) =================
@app.get("/api/pedidos/{pedido_id}")
def obtener_pedido(pedido_id: int, db: Session = Depends(get_db)):
    pedido = db.query(database.PedidoDB).filter(database.PedidoDB.id == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    
    return {
        "status": "success", 
        "data": {
            "id": pedido.id,
            "status": pedido.status,
            "rider_id": pedido.rider_id
        }
    }

# ================= 4. API PARA LOS RIDERS (SE CONECTAN AQUÍ) =================
@app.get("/api/pedidos/disponibles")
def obtener_disponibles(db: Session = Depends(get_db)):
    pedidos = db.query(database.PedidoDB).filter(database.PedidoDB.status == "pendiente").all()
    return {"data": pedidos}

@app.post("/api/pedidos/asignar/{pedido_id}")
def asignar_pedido(pedido_id: int, rider_id: str, db: Session = Depends(get_db)):
    pedido = db.query(database.PedidoDB).filter(database.PedidoDB.id == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    if pedido.status != "pendiente":
        raise HTTPException(status_code=400, detail="El pedido ya fue tomado por otro rider")
        
    pedido.rider_id = rider_id
    pedido.status = "en_camino" 
    db.commit()
    return {"status": "success"}

@app.post("/api/pedidos/rechazar")
def rechazar_pedidos(data: RechazoRequest, db: Session = Depends(get_db)):
    pedidos = db.query(database.PedidoDB).filter(database.PedidoDB.id.in_(data.pedido_ids)).all()
    for p in pedidos:
        p.rider_id = None 
        p.status = "pendiente" 
    db.commit()
    return {"status": "success"}

@app.put("/api/pedidos/{pedido_id}/estado")
def actualizar_estado(pedido_id: int, estado: EstadoUpdate, db: Session = Depends(get_db)):
    pedido = db.query(database.PedidoDB).filter(database.PedidoDB.id == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    
    pedido.status = estado.status
    db.commit()
    return {"status": "success"}