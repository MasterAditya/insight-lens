def save_uploaded_file(uploaded_file):
    with open(f"uploads/{uploaded_file.filename}", "wb") as f:
        f.write(uploaded_file.file.read())

def extract_text_from_pdf(pdf_file):
    from PyPDF2 import PdfReader
    reader = PdfReader(pdf_file)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

def extract_text_from_txt(txt_file):
    return txt_file.read().decode("utf-8")