import fs from "fs";
import path from "path";
import os from "os";

import { spawn } from "child_process";

export async function POST(req) {
  try {
    const formData =
      await req.formData();

    const file =
      formData.get("file");

    const level =
      formData.get(
        "level"
      ) || "medium";

    if (!file) {
      return Response.json(
        {
          error:
            "No file uploaded",
        },
        {
          status: 400,
        }
      );
    }

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const timestamp =
      Date.now();

    const inputPath =
      path.join(
        os.tmpdir(),
        `input-${timestamp}.pdf`
      );

    const outputPath =
      path.join(
        os.tmpdir(),
        `output-${timestamp}.pdf`
      );

    fs.writeFileSync(
      inputPath,
      buffer
    );

    let args = [];

    // LOW
    if (level === "low") {
      args = [
        "-sDEVICE=pdfwrite",
        "-dCompatibilityLevel=1.4",
        "-dPDFSETTINGS=/printer",
        "-dDetectDuplicateImages=true",
        "-dCompressFonts=true",
        "-dSubsetFonts=true",
        "-dDownsampleColorImages=true",
        "-dColorImageResolution=220",
        "-dDownsampleGrayImages=true",
        "-dGrayImageResolution=220",
        "-dJPEGQ=95",
      ];
    }

    // MEDIUM
    if (level === "medium") {
      args = [
        "-sDEVICE=pdfwrite",
        "-dCompatibilityLevel=1.4",
        "-dPDFSETTINGS=/ebook",
        "-dDetectDuplicateImages=true",
        "-dCompressFonts=true",
        "-dSubsetFonts=true",
        "-dDownsampleColorImages=true",
        "-dColorImageResolution=140",
        "-dDownsampleGrayImages=true",
        "-dGrayImageResolution=140",
        "-dJPEGQ=72",
      ];
    }

    // STRONG
    if (level === "strong") {
      args = [
        "-sDEVICE=pdfwrite",
        "-dCompatibilityLevel=1.4",
        "-dPDFSETTINGS=/screen",
        "-dDetectDuplicateImages=true",
        "-dCompressFonts=true",
        "-dSubsetFonts=true",
        "-dDownsampleColorImages=true",
        "-dDownsampleGrayImages=true",
        "-dDownsampleMonoImages=true",
        "-dColorImageResolution=72",
        "-dGrayImageResolution=72",
        "-dMonoImageResolution=100",
        "-dAutoFilterColorImages=false",
        "-dAutoFilterGrayImages=false",
        "-dColorImageFilter=/DCTEncode",
        "-dGrayImageFilter=/DCTEncode",
        "-dJPEGQ=35",
      ];
    }

    const gsArgs = [
      ...args,

      "-dNOPAUSE",

      "-dQUIET",

      "-dBATCH",

      `-sOutputFile=${outputPath}`,

      inputPath,
    ];

    await new Promise(
      (
        resolve,
        reject
      ) => {
        const gs = spawn(
          "gswin32c",
          gsArgs
        );

        gs.stderr.on(
          "data",
          (data) => {
            console.log(
              data.toString()
            );
          }
        );

        gs.on(
          "close",
          (code) => {
            if (code === 0) {
              resolve(true);
            } else {
              reject(
                new Error(
                  "Ghostscript failed"
                )
              );
            }
          }
        );
      }
    );

    if (
      !fs.existsSync(
        outputPath
      )
    ) {
      throw new Error(
        "Compressed PDF not created"
      );
    }

    const compressed =
      fs.readFileSync(
        outputPath
      );

    // CLEANUP
    fs.unlinkSync(inputPath);

    fs.unlinkSync(outputPath);

    return new Response(
      compressed,
      {
        headers: {
          "Content-Type":
            "application/pdf",

          "Content-Disposition":
            `attachment; filename="${file.name.replace(
              ".pdf",
              "_compressed.pdf"
            )}"`,
        },
      }
    );
  } catch (err) {
    console.error(err);

    return Response.json(
      {
        error:
          "Compression failed",
      },
      {
        status: 500,
      }
    );
  }
}