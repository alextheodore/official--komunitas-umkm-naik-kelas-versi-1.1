import streamlit as st
from ina_agent import INAAgent
from models_api import llm 

st.set_page_config(page_title="INA - Konsultan UMKM AI", page_icon="🤖", layout="wide")

@st.cache_resource
def load_agent():
    return INAAgent(llm)

agent = load_agent()

st.title("🤖 INA - Konsultan UMKM Indonesia")
st.markdown("""
Halo! Saya **INA**, Asisten Kecerdasan Buatan untuk membantu UMKM Indonesia.
Saya bisa membantu dengan: Analisis SWOT, Kalkulasi Keuangan, dan Rekomendasi Platform.
""")

with st.sidebar:
    st.header("👤 Profil UMKM")
    nama = st.text_input("Nama Pemilik")
    jenis = st.selectbox("Jenis Usaha", ["Makanan/Minuman", "Fashion", "Jasa", "Kerajinan", "Pertanian", "Lainnya"])
    lokasi = st.text_input("Lokasi (Kota)")
    if st.button("Simpan Profil"):
        st.success(f"Profil {nama} tersimpan!")
    st.divider()
    st.caption("🚀 Fitur Gratis - Prototype v1.0")

st.header("💬 Konsultasi dengan INA")

if "messages" not in st.session_state:
    st.session_state.messages = [{"role": "assistant", "content": "Halo! Saya INA. Ada yang bisa saya bantu hari ini?"}]

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

if prompt := st.chat_input("Tulis pertanyaan Anda..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        with st.spinner("INA sedang berpikir..."):
            response = agent.chat(prompt)
            st.markdown(response)
    st.session_state.messages.append({"role": "assistant", "content": response})

st.divider()
col1, col2, col3 = st.columns(3)
with col1:
    if st.button("📊 Analisis SWOT Cepat"):
        response = agent.chat(f"Buat analisis SWOT untuk usaha {jenis} di {lokasi}")
        st.info(response)
with col2:
    if st.button("💰 Kalkulator Keuangan"):
        st.write("Gunakan chat untuk input angka spesifik.")
with col3:
    if st.button("📱 Rekomendasi Digital"):
        response = agent.chat(f"Rekomendasi platform digital untuk usaha {jenis}")
        st.warning(response)