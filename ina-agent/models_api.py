from langchain_openai import ChatOpenAI
from langchain_community.embeddings import HuggingFaceEmbeddings
from dotenv import load_dotenv
import os

load_dotenv()

llm = ChatOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    model="deepseek/deepseek-v3.2",
    temperature=0.2,
    max_tokens=1500,
    streaming=True,
    default_headers={
        "HTTP-Referer": "http://localhost:8501",  
        "X-Title": "INA-UMKM-Agent"
    }
)

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)