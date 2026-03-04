from langchain.agents import AgentExecutor, create_react_agent
from langchain import hub
from langchain.tools import Tool, StructuredTool # Tambahkan StructuredTool
from langchain.memory import ConversationBufferMemory
import sqlite3
import json

class INAAgent:
    def __init__(self, llm):
        self.llm = llm
        self.memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
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

        # Tool 2: Kalkulator Keuangan (Multi-argument)
        def kalkulator_keuangan(modal: float, margin: float) -> str:
            """Hitung proyeksi keuangan sederhana. Butuh angka modal dan margin."""
            try:
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
            except Exception as e:
                return f"Gagal menghitung: {str(e)}. Pastikan input adalah angka."

        # Tool 3: Rekomendasi Platform
        def rekomendasi_platform(jenis_usaha: str) -> str:
            """Rekomendasi platform digital berdasarkan jenis usaha"""
            platforms = {
                "makanan": ["GoFood", "GrabFood", "ShopeeFood", "Instagram"],
                "fashion": ["Shopee", "Tokopedia", "Instagram", "TikTok Shop"],
                "jasa": ["Instagram", "Facebook", "Google Business", "WhatsApp Business"],
                "kerajinan": ["Etsy", "Tokopedia", "Instagram", "Pameran Online"],
            }
            rec = platforms.get(jenis_usaha.lower(), ["Instagram", "WhatsApp Business", "Facebook"])
            return f"Rekomendasi untuk {jenis_usaha}: {', '.join(rec)}"

        # Definisikan tools
        self.tools = [
            Tool(
                name="Analisis_SWOT",
                func=analisis_swot,
                description="Gunakan ini untuk menganalisis kelebihan dan kekurangan usaha. Input: nama jenis usaha (misal: 'bakso')."
            ),
            # GUNAKAN StructuredTool untuk fungsi dengan > 1 parameter
            StructuredTool.from_function(
                func=kalkulator_keuangan,
                name="Kalkulator_Keuangan",
                description="Gunakan ini untuk menghitung keuntungan. Input harus berupa objek dengan 'modal' (angka) dan 'margin' (angka persen)."
            ),
            Tool(
                name="Rekomendasi_Platform",
                func=rekomendasi_platform,
                description="Gunakan ini untuk mencari tempat jualan online. Input: kategori usaha."
            ),
        ]

    def setup_agent(self):
        """Setup agent dengan ReAct pattern"""
        # Menggunakan structured-chat-agent karena kita punya tools dengan multi-input
        prompt = hub.pull("hwchase17/structured-chat-agent") 
        
        # Perhatikan penggunaan create_structured_chat_agent jika menggunakan StructuredTool
        from langchain.agents import create_structured_chat_agent
        self.agent = create_structured_chat_agent(llm=self.llm, tools=self.tools, prompt=prompt)
        
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
            # Gunakan invoke sesuai standar LangChain terbaru
            response = self.agent_executor.invoke(
                {"input": input_text}
            )
            return response["output"]
        except Exception as e:
            return f"Maaf terjadi error teknis: {str(e)}"