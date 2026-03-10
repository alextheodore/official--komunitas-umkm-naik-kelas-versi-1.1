import os
from dotenv import load_dotenv
from langchain.chat_models import ChatOpenAI
from langchain.adapters.openai import convert_openai_messages
from langchain_core.messages import HumanMessage

load_dotenv()

def get_llm(model_name="deepseek/deepseek-r1:free"):
    return ChatOpenAI(
        openai_api_key=os.getenv("OPENAI_API_KEY"),
        model_name=model_name,
        openai_api_base="https://openrouter.ai/api/v1",
        temperature=0,
        max_retries=3, # Mencoba lagi otomatis sampai 3x jika limit tercapai
        timeout=60     # Menunggu hingga 60 detik sebelum dianggap gagal
    )

# 1. Inisialisasi Model Utama (DeepSeek)
primary_llm = get_llm("deepseek/deepseek-r1:free")

# 2. Inisialisasi Model Cadangan (Llama 3.3 atau Gemini Flash)
# Jika DeepSeek limit, dia akan otomatis pakai ini
fallback_llm = get_llm("meta-llama/llama-3.3-70b-instruct:free")

# 3. Gabungkan menjadi satu LLM pintar
llm = primary_llm.with_fallbacks([fallback_llm])