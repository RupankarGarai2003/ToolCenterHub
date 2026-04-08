import subprocess
import os
import platform


# =========================
# 🔥 RUN GHOSTSCRIPT
# =========================
def run_gs(input_path, output_path, args):
    gs_bin = "gswin64c" if platform.system() == "Windows" else "gs"

    cmd = [gs_bin] + args + [
        f"-sOutputFile={output_path}",
        input_path,
    ]

    subprocess.run(cmd, check=True)


# =========================
# 🔥 MAIN FUNCTION
# =========================
def compress_pdf(input_path, output_path, level="medium"):

    original_size = os.path.getsize(input_path)

    # temp files
    temp1 = output_path + "_pass1.pdf"
    temp2 = output_path + "_pass2.pdf"

    # =========================
    # 🧼 PASS 1 → CLEAN PDF
    # =========================
    run_gs(input_path, temp1, [
        "-sDEVICE=pdfwrite",
        "-dCompatibilityLevel=1.4",
        "-dNOPAUSE",
        "-dQUIET",
        "-dBATCH",

        # normalize structure
        "-dDetectDuplicateImages=true",
        "-dCompressStreams=true",
        "-dOptimize=true",
    ])

    # =========================
    # 🔥 PASS 2 → COMPRESSION LEVEL
    # =========================
    if level == "low":
        dpi = 150
        jpeg_q = 65
        preset = "/ebook"
    elif level == "medium":
        dpi = 100
        jpeg_q = 45
        preset = "/ebook"
    else:  # strong
        dpi = 60
        jpeg_q = 30
        preset = "/screen"

    run_gs(temp1, temp2, [
        "-sDEVICE=pdfwrite",
        "-dCompatibilityLevel=1.4",
        f"-dPDFSETTINGS={preset}",
        "-dNOPAUSE",
        "-dQUIET",
        "-dBATCH",

        # image compression
        "-dDownsampleColorImages=true",
        "-dColorImageDownsampleType=/Bicubic",
        f"-dColorImageResolution={dpi}",

        "-dDownsampleGrayImages=true",
        "-dGrayImageDownsampleType=/Bicubic",
        f"-dGrayImageResolution={dpi}",

        "-dDownsampleMonoImages=true",
        f"-dMonoImageResolution={dpi}",

        # strong JPEG
        "-dAutoFilterColorImages=false",
        "-dColorImageFilter=/DCTEncode",
        f"-dJPEGQ={jpeg_q}",

        "-dAutoFilterGrayImages=false",
        "-dGrayImageFilter=/DCTEncode",
        f"-dGrayImageQualityFactor={jpeg_q / 100}",

        # font optimization
        "-dSubsetFonts=true",
        "-dEmbedAllFonts=false",

        # cleanup
        "-dCompressStreams=true",
        "-dOptimize=true",
    ])

    # =========================
    # 🚀 PASS 3 → DEEP OPTIMIZATION (KEY)
    # =========================
    run_gs(temp2, output_path, [
        "-sDEVICE=pdfwrite",
        "-dCompatibilityLevel=1.4",
        "-dNOPAUSE",
        "-dQUIET",
        "-dBATCH",

        # 🔥 THIS IS THE SECRET
        "-dUseObjectStreams=true",
        "-dCompressStreams=true",
        "-dOptimize=true",

        # remove extra data
        "-dSubsetFonts=true",
        "-dEmbedAllFonts=false",
    ])

    # cleanup temp files
    for f in [temp1, temp2]:
        if os.path.exists(f):
            try:
                os.remove(f)
            except:
                pass

    # =========================
    # 📊 STATS
    # =========================
    compressed_size = os.path.getsize(output_path)

    reduction = (
        ((original_size - compressed_size) / original_size) * 100
        if original_size > 0 else 0
    )

    return {
        "original_size": original_size,
        "compressed_size": compressed_size,
        "reduction": round(reduction, 2),
    }