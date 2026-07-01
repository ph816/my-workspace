#!/usr/bin/env bash
set -euo pipefail

# =========================
# Config
# =========================
PDF_URL="https://pmc.ncbi.nlm.nih.gov/articles/PMC7386961/pdf/medi-99-e20696.pdf"
WORKDIR="${PWD}/pcos_paper_work"
OUT_PDF="${PWD}/肌醇与α-硫辛酸联合治疗多囊卵巢综合征的效果.pdf"

# OpenAI API (required for translation)
# export OPENAI_API_KEY="sk-..."
if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  echo "ERROR: OPENAI_API_KEY is not set."
  echo "Please run: export OPENAI_API_KEY='your_key'"
  exit 1
fi

# =========================
# 1) System deps
# =========================
echo "[1/7] Installing system dependencies (Ubuntu 22.04)..."
sudo apt-get update -y
sudo apt-get install -y \
  python3 python3-venv python3-pip \
  poppler-utils \
  tesseract-ocr tesseract-ocr-chi-sim tesseract-ocr-eng \
  libgl1 \
  fonts-noto-cjk \
  wget curl git

# =========================
# 2) Python env
# =========================
echo "[2/7] Creating Python virtual environment..."
mkdir -p "$WORKDIR"
cd "$WORKDIR"
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip

echo "[3/7] Installing Python packages..."
pip install \
  pymupdf==1.24.9 \
  pdfplumber==0.11.4 \
  pypdf==4.3.1 \
  reportlab==4.2.2 \
  openai==1.51.0 \
  tenacity==9.0.0 \
  tqdm==4.66.5

# =========================
# 3) Download source PDF
# =========================
echo "[4/7] Downloading source PDF..."
wget -O source.pdf "$PDF_URL"

# =========================
# 4) Create Python translator
# =========================
cat > run_translate.py << 'PYEOF'
import os
import re
from pathlib import Path
from tenacity import retry, stop_after_attempt, wait_exponential
from tqdm import tqdm

import fitz  # PyMuPDF
import pdfplumber
from openai import OpenAI
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

SRC_PDF = Path("source.pdf")
OUT_TXT = Path("translated_zh.txt")
OUT_PDF = Path("out_zh.pdf")

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

SYSTEM_PROMPT = """你是一位医学论文专业翻译。
要求：
1) 将英文准确翻译成简体中文；
2) 严格保留所有数字、单位、统计符号（如 P、OR、95% CI、SD、mg、μIU/mL）；
3) 表格内容按原行列语义翻译，不改变数值；
4) 若遇到缩写，首次出现时可加中文释义（括号内），后续保持一致；
5) 仅输出译文，不要解释。"""

def chunk_text(text, max_chars=3500):
    text = text.strip()
    if not text:
        return []
    paras = text.split("\n\n")
    chunks, cur = [], []
    cur_len = 0
    for p in paras:
        p = p.strip()
        if not p:
            continue
        add_len = len(p) + 2
        if cur_len + add_len > max_chars and cur:
            chunks.append("\n\n".join(cur))
            cur = [p]
            cur_len = add_len
        else:
            cur.append(p)
            cur_len += add_len
    if cur:
        chunks.append("\n\n".join(cur))
    return chunks

@retry(stop=stop_after_attempt(5), wait=wait_exponential(multiplier=1, min=2, max=20))
def translate_chunk(chunk: str) -> str:
    resp = client.responses.create(
        model="gpt-4.1",
        input=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": chunk}
        ],
        temperature=0
    )
    return resp.output_text.strip()

def extract_text_with_layout(pdf_path: Path) -> str:
    doc = fitz.open(pdf_path)
    pages = []
    for i in range(len(doc)):
        page = doc[i]
        txt = page.get_text("text")
        txt = re.sub(r"\n{3,}", "\n\n", txt).strip()
        pages.append(f"[Page {i+1}]\n{txt}")
    doc.close()

    table_parts = []
    with pdfplumber.open(str(pdf_path)) as pdoc:
        for pi, p in enumerate(pdoc.pages, start=1):
            tables = p.extract_tables() or []
            for ti, tb in enumerate(tables, start=1):
                lines = [f"[Page {pi} Table {ti}]"]
                for row in tb:
                    row = [("" if c is None else str(c).replace("\n"," ").strip()) for c in row]
                    lines.append(" | ".join(row))
                table_parts.append("\n".join(lines))

    body = "\n\n".join(pages)
    tables = "\n\n".join(table_parts)
    if tables.strip():
        return body + "\n\n[Extracted Tables]\n" + tables
    return body

def normalize_spaces(s: str) -> str:
    s = s.replace("\u00a0", " ")
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip()

def render_pdf_from_text(text: str, out_pdf: Path, title: str):
    pdfmetrics.registerFont(UnicodeCIDFont("STSong-Light"))
    c = canvas.Canvas(str(out_pdf), pagesize=A4)
    width, height = A4

    margin_x = 48
    margin_top = 60
    margin_bottom = 50
    line_h = 18

    def draw_header(page_no):
        c.setFont("STSong-Light", 11)
        c.drawString(margin_x, height - 38, title)
        c.drawRightString(width - margin_x, height - 38, f"{page_no}")

    y = height - margin_top
    page_no = 1
    draw_header(page_no)

    c.setFont("STSong-Light", 12)

    for para in text.split("\n"):
        if para.strip() == "":
            y -= line_h * 0.6
            if y < margin_bottom:
                c.showPage()
                page_no += 1
                draw_header(page_no)
                c.setFont("STSong-Light", 12)
                y = height - margin_top
            continue

        max_chars = 46
        line = ""
        for ch in para:
            line += ch
            if len(line) >= max_chars:
                c.drawString(margin_x, y, line)
                y -= line_h
                line = ""
                if y < margin_bottom:
                    c.showPage()
                    page_no += 1
                    draw_header(page_no)
                    c.setFont("STSong-Light", 12)
                    y = height - margin_top
        if line:
            c.drawString(margin_x, y, line)
            y -= line_h
            if y < margin_bottom:
                c.showPage()
                page_no += 1
                draw_header(page_no)
                c.setFont("STSong-Light", 12)
                y = height - margin_top

    c.save()

def main():
    if not SRC_PDF.exists():
        raise FileNotFoundError("source.pdf not found")

    print("Extracting source text...")
    raw = extract_text_with_layout(SRC_PDF)
    raw = normalize_spaces(raw)

    title_cn = "肌醇与α-硫辛酸联合治疗多囊卵巢综合征的效果"
    prefix = f"{title_cn}\n\n（以下为英文原文的中文翻译，已尽量保留专业术语与数据格式）\n\n"
    chunks = chunk_text(raw, max_chars=3200)

    print(f"Translating {len(chunks)} chunks...")
    zh_parts = [prefix]
    for ch in tqdm(chunks):
        zh = translate_chunk(ch)
        zh_parts.append(zh)

    zh_text = "\n\n".join(zh_parts)
    OUT_TXT.write_text(zh_text, encoding="utf-8")
    print(f"Saved translated text: {OUT_TXT}")

    print("Rendering Chinese PDF...")
    render_pdf_from_text(zh_text, OUT_PDF, title_cn)
    print(f"Saved PDF: {OUT_PDF}")

if __name__ == "__main__":
    main()
PYEOF

# =========================
# 5) Run translation
# =========================
echo "[5/7] Running translation (this may take several minutes)..."
source .venv/bin/activate
python run_translate.py

# =========================
# 6) Move final PDF
# =========================
echo "[6/7] Moving output PDF..."
mv -f out_zh.pdf "$OUT_PDF"

# =========================
# 7) Done
# =========================
echo "[7/7] Done."
echo "Output: $OUT_PDF"
echo "Also text file: $WORKDIR/translated_zh.txt"
