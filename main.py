from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
import database

# 1. TU CÓDIGO ORIGINAL: Crea las tablas en la base de datos si aún no existen
database.Base.metadata.create_all(bind=database.engine)

# Iniciar la aplicación de FastAPI
app = FastAPI(title="Rapi Delivery API Master")

# Habilitar conexiones (ESTO ES LO ÚNICO NUEVO ARRIBA PARA QUE EL RIDER PUEDA ENTRAR)
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

# ================= 1. TU CÓDIGO ORIGINAL QUE FUNCIONA PERFECTO =================
# IMPORTANTE: Aquí le decimos a Python dónde están tus CSS y JS.
# Montamos la carpeta "static" para que el HTML pueda leer los estilos.
app.mount("/static", StaticFiles(directory="static"), name="static")

# Ruta principal: Cuando alguien entre a tu link, se pinta el index.html
@app.get("/")
async def read_root():
    return FileResponse("index.html")

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
        status="pendiente" 
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