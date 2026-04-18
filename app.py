import os
os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"
import streamlit as st
import base64
import re
from datetime import datetime, timezone
from app.pipeline import run_pipeline, get_collection
from app.refusal import DISCLAIMER

# --- SET PAGE CONFIG ---
st.set_page_config(
    page_title="MF FAQ Assistant | Groww",
    page_icon="https://groww.in/favicon.ico",
    layout="wide"
)

# Handle Query Params for FAB click
if "open_chat" in st.query_params:
    st.session_state.chat_open = (st.query_params["open_chat"] == "true")
    st.session_state.discovery_seen = True
    st.query_params.clear()

# --- LOAD ASSETS ---
def get_base64_image(file_path):
    with open(file_path, "rb") as f:
        data = f.read()
    return base64.b64encode(data).decode()

DASHBOARD_B64 = get_base64_image("groww-chat-ui/src/assets/dashboard.png")

# --- CUSTOM CSS (Mirrored from ChatBot.css) ---
def inject_custom_css():
    st.markdown(f"""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    :root {{
      --groww-green: #00B386;
      --bubble-bot: #FFFFFF;
      --bubble-user: #00B386;
      --text-main: #444444;
      --text-sub: #777777;
    }}

    /* Background Image */
    .stApp {{
        background-image: url("data:image/png;base64,{DASHBOARD_B64}");
        background-size: cover;
        background-position: top center;
        background-attachment: fixed;
    }}

    header {{visibility: hidden;}}
    footer {{visibility: hidden;}}
    #MainMenu {{visibility: hidden;}}

    /* THE DRAMATIC DRAWER FIX (v4) - 1:1 with React */
    [data-testid="stSidebar"] {{
        position: fixed !important;
        right: 30px !important;
        left: auto !important;
        bottom: 115px !important;
        height: 640px !important;
        width: 400px !important;
        max-width: 90vw !important;
        background-color: rgba(255, 255, 255, 0.98) !important;
        backdrop-filter: blur(10px) !important;
        border-radius: 12px !important;
        box-shadow: 0 12px 60px rgba(0, 0, 0, 0.12) !important;
        z-index: 100000 !important;
        border: 1px solid rgba(0, 179, 134, 0.1) !important;
        overflow: hidden !important;
        font-family: 'Inter', sans-serif !important;
        transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) !important;
    }}

    [data-testid="stMain"] {{ margin-left: 0 !important; padding-left: 0 !important; }}
    [data-testid="stSidebarCollapsedControl"] {{ display: none !important; }}
    [data-testid="stSidebarNav"] {{ display: none !important; }}

    /* Floating Action Button (FAB) */
    .custom-fab {{
        position: fixed;
        bottom: 40px;
        right: 30px;
        width: 65px;
        height: 65px;
        background: #00B386;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 100000;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }}
    .custom-fab:hover {{ transform: scale(1.1); font-size: 32px; }}

    .pulse-effect {{
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #00B386;
        opacity: 0.6;
        animation: pulse 2s infinite;
        z-index: -1;
    }}
    @keyframes pulse {{
        0% {{ transform: scale(1); opacity: 0.6; }}
        100% {{ transform: scale(1.6); opacity: 0; }}
    }}

    /* CUSTOM MESSAGE BUBBLES */
    .msg-wrapper {{
        display: flex;
        flex-direction: column;
        margin-bottom: 16px;
        max-width: 88%;
    }}
    .user-wrapper {{ align-self: flex-end; }}
    .bot-wrapper {{ align-self: flex-start; }}

    .bubble {{
        padding: 10px 14px;
        font-size: 14px;
        line-height: 1.5;
        box-shadow: 0 2px 12px rgba(0,0,0,0.03);
    }}

    .user-pill {{
        background: var(--groww-green);
        color: white;
        border-radius: 16px 16px 4px 16px;
        font-weight: 500;
    }}

    .bot-card {{
        background: var(--bubble-bot);
        color: var(--text-main);
        border: 1px solid #EEF2F1;
        border-radius: 16px 16px 16px 4px;
    }}

    .source-btn {{
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #E6F7F2;
        color: var(--groww-green);
        padding: 5px 12px;
        border-radius: 6px;
        font-size: 11px;
        margin-top: 8px;
        text-decoration: none;
        font-weight: 600;
        border: 1px solid rgba(0, 179, 134, 0.2);
        width: fit-content;
    }}

    .meta-text {{
        font-size: 10px;
        color: #AAA;
        margin-top: 6px;
        font-weight: 500;
    }}

    /* Header & Disclaimer */
    .header-groww {{
        background: var(--groww-green);
        padding: 12px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: white;
    }}

    .disc-bar {{
        background: #E6F7F2;
        padding: 8px 12px;
        text-align: center;
        font-size: 11px;
        color: #0F6E56;
        border-bottom: 1px solid #9FE1CB;
    }}

    /* Footer Marquee */
    .footer-marquee {{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: #000;
        height: 40px;
        display: flex;
        align-items: center;
        overflow: hidden;
        z-index: 99998;
    }}
    .marquee-lbl {{
        background: #000;
        color: var(--groww-green);
        font-size: 11px;
        font-weight: 700;
        padding: 0 15px;
        z-index: 2;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }}
    .marquee-txt {{
        display: flex;
        white-space: nowrap;
        animation: marquee-scroll 40s linear infinite;
        color: #aaa;
        font-size: 12px;
    }}
    @keyframes marquee-scroll {{
        0% {{ transform: translateX(0); }}
        100% {{ transform: translateX(-50%); }}
    }}
    </style>
    """, unsafe_allow_html=True)

# --- HELPER: RENDER MESSAGE ---
def render_message(role, content, source_url=None, scraped_at=None):
    if role == "user":
        st.markdown(f"""
            <div class="msg-wrapper user-wrapper">
                <div class="bubble user-pill">{content}</div>
                <div class="meta-text" style="text-align:right;">{datetime.now().strftime('%H:%M')}</div>
            </div>
        """, unsafe_allow_html=True)
    else:
        source_html = f'<a href="{source_url}" target="_blank" class="source-btn">View Source</a>' if source_url else ""
        meta_html = f'<div class="meta-text">Last updated: {scraped_at.split("T")[0]}</div>' if scraped_at else ""
        st.markdown(f"""
            <div class="msg-wrapper bot-wrapper">
                <div class="bubble bot-card">{content}</div>
                {source_html}
                {meta_html}
            </div>
        """, unsafe_allow_html=True)

# --- MAIN APP LOGIC ---
def main():
    inject_custom_css()

    if "chat_open" not in st.session_state:
        st.session_state.chat_open = False
    if "messages" not in st.session_state:
        st.session_state.messages = []

    # --- FAB ---
    if not st.session_state.chat_open:
        st.markdown(f"""
        <a href="/?open_chat=true" class="custom-fab" target="_self">
            <div class="pulse-effect"></div>
            <span style="font-size:32px;">🤖</span>
        </a>
        """, unsafe_allow_html=True)

    # --- CHAT MODAL (Relocated to Sidebar) ---
    if st.session_state.chat_open:
        with st.sidebar:
            # Header
            st.markdown(f"""
                <div class="header-groww">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <div style="background:white; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center;">
                            <span style="color:var(--groww-green); font-size:16px;">🤖</span>
                        </div>
                        <div>
                            <div style="font-size:14px; font-weight:600;">MF FAQ Assistant</div>
                            <div style="font-size:11px; opacity:0.9;">Powered by AI • No Advice</div>
                        </div>
                    </div>
                    <a href="/?open_chat=false" style="color:white; text-decoration:none; font-size:20px;" target="_self">✖</a>
                </div>
                <div class="disc-bar">Facts only. Always consult a SEBI registered advisor.</div>
            """, unsafe_allow_html=True)
            
            # History Area
            chat_container = st.container(height=450)
            with chat_container:
                if not st.session_state.messages:
                    render_message("assistant", "Hi! I can help with mutual fund info like NAV, expense ratio, and returns. What would you like to know?")
                
                for msg in st.session_state.messages:
                    render_message(
                        msg["role"], 
                        msg["content"], 
                        source_url=msg.get("source"), 
                        scraped_at=msg.get("scraped_at")
                    )

            # Input
            def on_chat_submit():
                prompt = st.session_state.chat_input_val
                if prompt:
                    st.session_state.messages.append({"role": "user", "content": prompt})
                    response = run_pipeline(prompt)
                    source_match = re.search(r"Source:\s*(https?://[^\s|]+)", response)
                    source_url = source_match.group(1).strip() if source_match else None
                    
                    # Clean the response from the raw "Source:" text if present
                    clean_res = re.split(r"Source:", response)[0].strip()
                    
                    st.session_state.messages.append({
                        "role": "assistant", 
                        "content": clean_res,
                        "source": source_url,
                        "scraped_at": datetime.now().isoformat() # Placeholder for demonstration
                    })

            st.chat_input("Ask about Nippon Taiwan, ICICI Smallcap...", key="chat_input_val", on_submit=on_chat_submit)

    # --- MARQUEE FOOTER ---
    funds = ["ICICI Prudential ELSS", "Bluechip", "Smallcap", "Midcap", "Nippon India Taiwan", "HDFC Mid Cap", "Parag Parikh Flexi Cap"]
    marquee_content = " • ".join(funds)
    st.markdown(f"""
    <div class="footer-marquee">
        <div class="marquee-lbl">Answering For</div>
        <div class="marquee-txt">
            {" • ".join([f"<span>{f}</span>" for f in funds] * 4)}
        </div>
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()
