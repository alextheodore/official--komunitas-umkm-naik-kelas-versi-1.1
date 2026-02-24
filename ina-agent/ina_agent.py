from langchain.agents import AgentExecutor, create_react_agent
from langchain import hub
from langchain.tools import Tool
from langchain.memory import ConversationBufferMemory
import sqlite3
import json


class INAAgent:
    def __init__(self, llm):
        self.llm = llm
        self.memory = ConversationBufferMemory(memory_key="chat_history")
        self.setup_tools()
        self.setup_agent()

    def setup_tools(self):
        """Define tools untuk INA"""

        # Tool 1: Analisis SWOT
        def analisis_swot(usaha_type: str) -> str:
            """Analisis SWOT untuk jenis usaha tertentu"""
            template = f"""
Analisis SWOT untuk {usaha_type}:
KEKUATAN (Strengths):
1. Modal relatif kecil
2. Fleksibel dalam operasional
3. Dekat dengan pasar lokal 

KELEMAHAN (Weaknesses):
1. Akses modal terbatas
2. SDM terbatas
3. Teknologi belum maksimal

PELUANG (Opportunities):
1. Pasar digital berkembang
2. Dukungan pemerintah
3. Tren belanja online 

ANCAMAN (Threats):
1. Persaingan semakin ketat
2. Fluktuasi ekonomi
3. Perubahan regulasi 
"""
            return template

        # Tool 2: Kalkulator Keuangan
        def kalkulator_keuangan(modal: float, margin: float) -> str:
            """Hitung proyeksi keuangan sederhana"""
            keuntungan = modal * (margin / 100)
            roi = (keuntungan / modal) * 100
            return f"""
Hasil Perhitungan:
Modal: Rp {modal:,.0f}
Margin: {margin}%
Keuntungan/bulan: Rp {keuntungan:,.0f}
ROI: {roi:.1f}%
Break Even: {12/roi:.1f} bulan
"""

        # Tool 3: Rekomendasi Platform
        def rekomendasi_platform(jenis_usaha: str) -> str:
            """Rekomendasi platform digital berdasarkan jenis usaha"""
            platforms = {
                "makanan": ["GoFood", "GrabFood", "ShopeeFood", "Instagram"],
                "fashion": ["Shopee", "Tokopedia", "Instagram", "TikTok Shop"],
                "jasa": [
                    "Instagram",
                    "Facebook",
                    "Google Business",
                    "WhatsApp Business",
                ],
                "kerajinan": ["Etsy", "Tokopedia", "Instagram", "Pameran Online"],
            }
            rec = platforms.get(
                jenis_usaha.lower(), ["Instagram", "WhatsApp Business", "Facebook"]
            )
            return f"Rekomendasi untuk {jenis_usaha}: {', '.join(rec)}"

        # Definisikan tools ke dalam list LangChain
        self.tools = [
            Tool(
                name="Analisis_SWOT",
                func=analisis_swot,
                description="Analisis SWOT untuk jenis usaha",
            ),
            Tool(
                name="Kalkulator_Keuangan",
                func=kalkulator_keuangan,
                description="Kalkulator keuangan UMKM",
            ),
            Tool(
                name="Rekomendasi_Platform",
                func=rekomendasi_platform,
                description="Rekomendasi platform digital",
            ),
        ]

    def setup_agent(self):
        """Setup agent dengan ReAct pattern"""
        prompt = hub.pull("hwchase17/react-chat")
        self.agent = create_react_agent(llm=self.llm, tools=self.tools, prompt=prompt)
        self.agent_executor = AgentExecutor(
            agent=self.agent,
            tools=self.tools,
            memory=self.memory,
            verbose=True,
            handle_parsing_errors=True,
        )

    def chat(self, input_text: str) -> str:
        """Main chat function"""
        try:
            response = self.agent_executor.invoke(
                {"input": input_text, "chat_history": self.memory.buffer}
            )
            return response["output"]
        except Exception as e:
            return f"Maaf terjadi error: {str(e)}"
