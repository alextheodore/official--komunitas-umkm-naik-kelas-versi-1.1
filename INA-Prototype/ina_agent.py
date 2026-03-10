from langchain.agents import AgentExecutor, initialize_agent, AgentType
from langchain.tools import Tool
from langchain.memory import ConversationBufferMemory
import sqlite3
import json

class INAAgent:
    def __init__(self, llm):
        self.llm = llm
        # Ditambahkan return_messages=True agar kompatibel dengan chat models
        self.memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
        self.setup_tools()
        self.setup_agent()

    def setup_tools(self):
        # Tool 1: Analisis SWOT
        def analisis_swot(usaha_type: str) -> str:
            return f"""
Analisis SWOT untuk {usaha_type}:
KEKUATAN (Strengths): 1. Modal kecil, 2. Fleksibel, 3. Pasar lokal.
KELEMAHAN (Weaknesses): 1. Akses modal terbatas, 2. SDM terbatas.
PELUANG (Opportunities): 1. Pasar digital, 2. Dukungan pemerintah.
ANCAMAN (Threats): 1. Persaingan ketat, 2. Fluktuasi ekonomi.
"""

        # Tool 2: Kalkulator Keuangan
        def kalkulator_keuangan(query: str) -> str:
            # Sederhanakan tool untuk versi prototype
            return "Hasil Perhitungan: Keuntungan diestimasi 20% dari modal dengan ROI dalam 6-12 bulan."

        # Tool 3: Rekomendasi Platform
        def rekomendasi_platform(jenis_usaha: str) -> str:
            return f"Rekomendasi untuk {jenis_usaha}: Instagram, WhatsApp Business, dan Shopee/Tokopedia."

        self.tools = [
            Tool(name="Analisis_SWOT", func=analisis_swot, description="Gunakan untuk membuat analisis SWOT bisnis"),
            Tool(name="Kalkulator_Keuangan", func=kalkulator_keuangan, description="Gunakan untuk menghitung estimasi keuangan UMKM"),
            Tool(name="Rekomendasi_Platform", func=rekomendasi_platform, description="Gunakan untuk mencari platform jualan digital yang cocok")
        ]

    def setup_agent(self):
        # Menggunakan initialize_agent (Standar LangChain v0.0.350)
        self.agent_executor = initialize_agent(
            tools=self.tools,
            llm=self.llm,
            agent=AgentType.CHAT_CONVERSATIONAL_REACT_DESCRIPTION, # Lebih stabil untuk model Chat
            memory=self.memory,
            verbose=True,
            handle_parsing_errors=True
        )

    def chat(self, input_text: str) -> str:
        try:
            # Gunakan .run() atau .invoke()
            # Di v0.0.350, .run() seringkali lebih stabil untuk tipe agen ini
            response = self.agent_executor.run(input=input_text)
            return response
        except Exception as e:
            # Jika error "output" not found, ini adalah fallback
            return f"Maaf, INA sedang mengalami kendala teknis: {str(e)}"