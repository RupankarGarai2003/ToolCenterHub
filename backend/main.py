from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from compressor import compress_pdf

import tempfile
import os
import uuid
import asyncio

app = FastAPI(title="PDF Compressor API")

# ✅ CORS (allow frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=[
        "X-Original-Size",
        "X-Compressed-Size",
        "X-Reduction",
    ],
)

# =========================
# 🔥 MAIN ENDPOINT
# =========================
@app.post("/api/compress-pdf")
async def compress_pdf_endpoint(
    file: UploadFile = File(...),
    level: str = Form(default="medium"),
):
    # ✅ Validate file type
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    # ✅ Validate compression level
    if level not in ("low", "medium", "strong"):
        raise HTTPException(
            status_code=400,
            detail="level must be low | medium | strong"
        )

    # ✅ Create temp file paths
    job_id = uuid.uuid4().hex
    tmp_dir = tempfile.gettempdir()

    in_path = os.path.join(tmp_dir, f"{job_id}_input.pdf")
    out_path = os.path.join(tmp_dir, f"{job_id}_output.pdf")

    # =========================
    # 🔥 SAFE FILE STREAMING
    # =========================
    try:
        with open(in_path, "wb") as f:
            while True:
                chunk = await file.read(1024 * 1024)  # 1MB chunks
                if not chunk:
                    break
                f.write(chunk)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to save uploaded file")

    # =========================
    # 🔥 COMPRESSION
    # =========================
    try:
        stats = compress_pdf(in_path, out_path, level=level)

        # ✅ Validate output
        if not os.path.exists(out_path):
            raise RuntimeError("Output file missing")

        if os.path.getsize(out_path) == 0:
            raise RuntimeError("Output file is empty")

    except Exception as e:
        import traceback
        traceback.print_exc()  # 👈 shows real error in terminal
        raise HTTPException(status_code=500, detail=str(e))

    # =========================
    # 🔥 RESPONSE
    # =========================
    compressed_filename = file.filename.replace(".pdf", "_compressed.pdf")

    response = FileResponse(
        path=out_path,
        media_type="application/pdf",
        filename=compressed_filename,
    )

    # ✅ Add stats headers
    response.headers["X-Original-Size"] = str(stats["original_size"])
    response.headers["X-Compressed-Size"] = str(stats["compressed_size"])
    response.headers["X-Reduction"] = str(stats["reduction"])

    # =========================
    # 🔥 SAFE CLEANUP
    # =========================
    async def cleanup():
        await asyncio.sleep(15)  # wait for download to finish

        for path in [in_path, out_path]:
            if os.path.exists(path):
                try:
                    os.remove(path)
                except Exception:
                    pass

    asyncio.create_task(cleanup())

    return response


# =========================
# 🔥 HEALTH CHECK
# =========================
@app.get("/health")
def health():
    import subprocess
    import platform

    gs = "gswin64c" if platform.system() == "Windows" else "gs"

    try:
        r = subprocess.run([gs, "--version"], capture_output=True, text=True)
        gs_version = r.stdout.strip()
        gs_ok = r.returncode == 0
    except FileNotFoundError:
        gs_version = "NOT FOUND"
        gs_ok = False

    return {
        "status": "ok" if gs_ok else "ghostscript_missing",
        "ghostscript": gs_version,
    }