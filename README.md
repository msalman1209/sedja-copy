# Sejda Free PDF Tools — 100% Free & Private PDF Suite

A complete, high-fidelity replica of [Sejda.com](https://www.sejda.com/) built to provide **completely free, unlimited, and private PDF tools** for students, educators, and people worldwide who cannot afford paid PDF subscriptions.

---

## 🌟 Why This Exists
Commercial PDF software (like Adobe Acrobat or paid tiers on online tools) imposes heavy subscription fees or restrictive daily limits. This platform gives anyone access to premium PDF manipulation tools **100% free of charge**, with **zero sign-up**, **zero paywalls**, and **no document upload limits**.

### 🔒 100% In-Browser Privacy
Unlike services that upload your confidential documents to third-party servers, **all processing happens directly in your browser** using WebAssembly, `pdf-lib`, and `pdfjs-dist`.
- Your files **never leave your computer**.
- Works lightning-fast even on low-speed internet.
- 0 server hosting costs for the administrator.

---

## 🛠 Included Functional PDF Tools

| Tool | Capability |
| :--- | :--- |
| **PDF Editor** | Add new text (custom fonts/sizes/colors), draw freehand pen annotations, highlight text, whiteout/redact confidential data, place signatures, or start from a blank document. |
| **Merge PDF** | Select multiple PDF files and images, drag or use arrows to reorder pages, and merge them into a single PDF. |
| **Delete Pages** | Visual thumbnail preview grid of all pages; one-click deletion with undo support, and export clean PDF. |
| **Compress PDF** | Reduce PDF file size with presets (Recommended, Strong, Light) with size savings calculator. |
| **Split PDF** | Extract custom page ranges (e.g. `1-3, 5`) or split every page into separate PDFs in a single ZIP archive. |
| **Fill & Sign** | Draw your digital signature with a canvas or type your signature, and place it anywhere on the page. |
| **Rotate PDF** | Rotate individual pages or all pages 90°, 180°, or 270° clockwise/counter-clockwise. |
| **Watermark PDF** | Stamp custom text watermarks with opacity slider, rotation angle (-45° to 90°), and font size. |
| **Protect & Unlock** | Secure documents with passwords or strip password permissions from protected files. |
| **PDF to JPG** | High-resolution rendering of every PDF page to JPG/PNG with single download or complete ZIP download. |
| **JPG to PDF** | Convert photo scans and image files (JPG, PNG) into a unified PDF document. |
| **Crop PDF** | Trim page margins and boundary padding with visual box preview. |
| **Page Numbers** | Add sequential page numbers (`Page 1 of N`, `Page 1`, etc.) at bottom center, bottom right, or top. |
| **PDF to Text** | Extract all selectable text from the PDF with one-click copy to clipboard and `.txt` export. |

---

## 🚀 Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`

3. **Production Build**:
   ```bash
   npm run build
   ```
   The production-ready static files are placed in the `/dist` directory.

---

## 🌐 Free 1-Click Deployment (Vercel / Netlify / GitHub Pages)

Because this app runs 100% client-side, you can host it for free on:
- **Vercel**: Import the GitHub repo and click Deploy (Framework preset: `Vite`).
- **Netlify**: Drag and drop the `dist/` folder into Netlify Drop.
- **GitHub Pages**: Deploy the `dist` folder directly to GitHub Pages.

---

## 🎨 Design Authenticity
- Exact Sejda logo (Emerald `#00BB88` circle with white S curve).
- Sejda brand typography, header drop-down Mega Menu categorizing 30+ tools.
- Popular tools shortcuts and step-by-step How-To PDF Guides.
- Polka dot background styling and responsive mobile navigation.

