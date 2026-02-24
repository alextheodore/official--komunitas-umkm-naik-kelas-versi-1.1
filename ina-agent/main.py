from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Halo, ini API untuk INA-Prototype!"}