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

# --- CUSTOM CSS ---
def inject_custom_css():
    st.markdown(f"""
    <style>
    /* Background Image */
    .stApp {{
        background-image: url("data:image/png;base64,{DASHBOARD_B64}");
        background-size: cover;
        background-position: top center;
        background-attachment: fixed;
    }}

    /* Hide Streamlit Header & Footer */
    header {{visibility: hidden;}}
    footer {{visibility: hidden;}}
    #MainMenu {{visibility: hidden;}}

    /* Floating Action Button (FAB) */
    .custom-fab {{
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        background: #00B386;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 100005;
        cursor: pointer;
        text-decoration: none;
        transition: transform 0.2s ease;
    }}

    .custom-fab:hover {{ transform: scale(1.1); color: white; }}

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

    /* CHAT MODAL WINDOW */
    .chat-window-wrapper {{
        position: fixed;
        bottom: 105px;
        right: 30px;
        width: 380px;
        height: 600px;
        max-height: 80vh;
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        border-radius: 20px;
        z-index: 100000;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: slideUp 0.3s ease-out;
        border: 1px solid #eee;
    }}

    @keyframes slideUp {{
        from {{ transform: translateY(20px); opacity: 0; }}
        to {{ transform: translateY(0); opacity: 1; }}
    }}

    .chat-header {{
        padding: 16px 20px;
        background: #fff;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }}

    .chat-header-text {{
        font-weight: 600;
        color: #44475b;
        font-size: 16px;
    }}

    /* Adjusting Streamlit's container to look like a modal body */
    /* We use a specific div to find the container */
    [data-testid="stVerticalBlock"] > div:has(.chat-content-anchor) {{
        position: fixed !important;
        bottom: 105px !important;
        right: 30px !important;
        width: 380px !important;
        height: 600px !important;
        max-height: 80vh !important;
        background: white !important;
        border-radius: 20px !important;
        z-index: 100000 !important;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2) !important;
        overflow: hidden !important;
        border: 1px solid #eee !important;
        display: flex !important;
        flex-direction: column !important;
    }}

    /* Overlay */
    .discovery-overlay {{
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.4);
        z-index: 99999;
    }}

    .discovery-tooltip {{
        position: fixed;
        bottom: 110px;
        right: 30px;
        background: white;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 100002;
        font-size: 14px;
        font-weight: 500;
    }}

    .discovery-tooltip:after {{
        content: '';
        position: absolute;
        bottom: -6px;
        right: 20px;
        border-width: 6px 6px 0;
        border-style: solid;
        border-color: white transparent transparent;
    }}

    /* Bottom Marquee */
    .footer-ribbon {{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: #000;
        color: #fff;
        height: 30px;
        font-size: 11px;
        display: flex;
        align-items: center;
        z-index: 10;
        overflow: hidden;
    }}
    </style>
    """, unsafe_allow_html=True)

# --- MAIN APP LOGIC ---
def main():
    inject_custom_css()

    # Initialize Session State
    if "chat_open" not in st.session_state:
        st.session_state.chat_open = False
    if "discovery_seen" not in st.session_state:
        st.session_state.discovery_seen = False
    if "messages" not in st.session_state:
        st.session_state.messages = []

    # --- DISCOVERY EXPERIENCE ---
    if not st.session_state.discovery_seen and not st.session_state.chat_open:
        st.markdown('<div class="discovery-overlay"></div>', unsafe_allow_html=True)
        st.markdown('<div class="discovery-tooltip">Need help choosing funds? Chat with our AI assistant!</div>', unsafe_allow_html=True)

    # --- FLOATING ASSISTANT (FAB) ---
    fab_link = "/?open_chat=true" if not st.session_state.chat_open else "/?open_chat=false"
    st.markdown(f"""
    <a href="{fab_link}" class="custom-fab" target="_self">
        <div class="pulse-effect"></div>
        <span style="font-size: 30px;">{"🤖" if not st.session_state.chat_open else "✖️"}</span>
    </a>
    """, unsafe_allow_html=True)

    # --- FLOATING CHAT MODAL ---
    if st.session_state.chat_open:
        # We use an anchor to find this block in CSS
        st.markdown('<div class="chat-content-anchor"></div>', unsafe_allow_html=True)
        
        # This container is caught by our CSS and floated bottom-right
        with st.container():
            # Modal Header
            col_h1, col_h2 = st.columns([8, 1])
            with col_h1:
                st.markdown('<div style="font-weight:700; font-size:18px; color:#44475b; padding: 10px 0;">MF FAQ Assistant</div>', unsafe_allow_html=True)
                st.caption("Groww • Facts only • No advice")
            
            st.divider()

            # Chat History (Scrollable Area)
            # We use a sub-container with a fixed height in CSS for scrolling
            chat_area = st.container(height=380)
            with chat_area:
                for msg in st.session_state.messages:
                    with st.chat_message(msg["role"]):
                        st.write(msg["content"])
                        if msg.get("source"):
                            st.markdown(f'<small>[Source]({msg["source"]})</small>', unsafe_allow_html=True)

            # Chat Input (Anchored to the bottom of the modal)
            # Note: We use st.chat_input here, but it might still stick to screen bottom
            # In 1.35+, it usually stays inside the column/container it's in if specified.
            def on_chat_submit():
                prompt = st.session_state.chat_input_val
                if prompt:
                    st.session_state.messages.append({"role": "user", "content": prompt})
                    response = run_pipeline(prompt)
                    source_match = re.search(r"Source:\s*(https?://[^\s|]+)", response)
                    source_url = source_match.group(1).strip() if source_match else None
                    st.session_state.messages.append({
                        "role": "assistant", 
                        "content": response,
                        "source": source_url
                    })

            st.chat_input("Ask a factual question…", key="chat_input_val", on_submit=on_chat_submit)

    # --- BOTTOM MARQUEE ---
    schemes = ["ICICI Prudential ELSS Tax Saver Fund", "ICICI Prudential Bluechip Fund", "ICICI Prudential Smallcap Fund"]
    marquee_text = " • ".join(schemes)
    st.markdown(f"""
    <div class="footer-ribbon">
        <div style="white-space:nowrap; padding-left:20px;">This chatbot works for: {marquee_text} • {marquee_text}</div>
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()
