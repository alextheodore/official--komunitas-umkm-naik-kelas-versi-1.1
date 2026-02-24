import streamlit as st
from ina_agent import INAAgent
from models_api import llm  

# Setup Streamlit
st.set_page_config(
    page_title="INA - Konsultan UMKM AI",
    page_icon="🇮🇩",
    layout="wide"
)

# Initialize agent
@st.cache_resource
def load_agent():
    return INAAgent(llm)

agent = load_agent()

# UI Header
st.title("🤖 INA - Konsultan UMKM Indonesia")
st.markdown("""
Halo! Saya **INA**, Asisten Kecerdasan Buatan untuk membantu UMKM Indonesia.
Saya bisa membantu dengan:
- 📊 Analisis SWOT usaha Anda
- 💰 Kalkulasi keuangan dan proyeksi
- 📱 Rekomendasi platform digital
- 📋 Konsultasi bisnis dasar
""")

# Sidebar untuk info UMKM
with st.sidebar:
    st.header("📝 Profil UMKM")
    nama = st.text_input("Nama Pemilik")
    jenis = st.selectbox("Jenis Usaha",
        ["Makanan/Minuman", "Fashion", "Jasa", "Kerajinan", "Pertanian", "Lainnya"])
    lokasi = st.text_input("Lokasi (Kota)")

    if st.button("Simpan Profil"):
        st.success(f"Profil {nama} tersimpan!")

    st.divider()
    st.caption("✨ Fitur Gratis - Prototype v1.0")

# Main chat interface
st.header("💬 Konsultasi dengan INA")

# Initialize chat history
if "messages" not in st.session_state:
    st.session_state.messages = [
        {"role": "assistant", "content": "Halo! Saya INA. Ada yang bisa saya bantu hari ini?"}
    ]

# Display chat messages
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Chat input
if prompt := st.chat_input("Tulis pertanyaan Anda..."):
    # Add user message
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    # Get AI response
    with st.chat_message("assistant"):
        with st.spinner("INA sedang berpikir..."):
            response = agent.chat(prompt)
            st.markdown(response)

    # Add AI response to history
    st.session_state.messages.append({"role": "assistant", "content": response})

# Additional features
st.divider()
col1, col2, col3 = st.columns(3)

with col1:
    if st.button("📊 Analisis SWOT Cepat"):
        response = agent.chat(f"Buat analisis SWOT untuk usaha {jenis} di {lokasi}")
        st.info(response)

with col2:
    if st.button("💰 Kalkulator Keuangan"):
        modal = st.number_input("Modal Awal (Rp)", value=10000000)
        margin = st.slider("Margin Keuntungan (%)", 10, 50, 30)
        response = agent.chat(f"Hitung proyeksi keuangan dengan modal {modal} dan margin {margin}%")
        st.success(response)

with col3:
    if st.button("📱 Rekomendasi Digital"):
        response = agent.chat(f"Rekomendasi platform digital untuk usaha {jenis}")
        st.warning(response)