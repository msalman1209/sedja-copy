// Comprehensive catalog of all PDF tools matching Sejda's full feature set

export const POPULAR_TOOLS = [
  {
    id: 'pdf-editor',
    name: 'Edit PDF',
    slug: 'pdf-editor',
    desc: 'Edit PDF files for free. Add text, links, images, signatures and shapes.',
    icon: 'Edit3',
    badge: 'Popular',
    category: 'Edit & Sign'
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    slug: 'merge-pdf',
    desc: 'Combine multiple PDFs and images into one single organized document.',
    icon: 'Layers',
    badge: 'Popular',
    category: 'Merge'
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    slug: 'compress-pdf',
    desc: 'Reduce the file size of your PDF documents while preserving quality.',
    icon: 'Minimize2',
    badge: 'Popular',
    category: 'Edit & Sign'
  },
  {
    id: 'delete-pdf-pages',
    name: 'Delete Pages',
    slug: 'delete-pdf-pages',
    desc: 'Remove unwanted pages quickly from any PDF document with visual preview.',
    icon: 'Trash2',
    badge: 'Fast',
    category: 'Merge'
  },
  {
    id: 'sign-pdf',
    name: 'Fill & Sign',
    slug: 'sign-pdf',
    desc: 'Add signature to PDF, fill out forms, add initials, checkmarks and dates.',
    icon: 'PenTool',
    badge: 'Popular',
    category: 'Edit & Sign'
  },
  {
    id: 'crop-pdf',
    name: 'Crop PDF',
    slug: 'crop-pdf',
    desc: 'Trim PDF margins, adjust page sizes, or crop specific page areas.',
    icon: 'Crop',
    badge: '',
    category: 'Other'
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    slug: 'split-pdf',
    desc: 'Split specific page ranges or extract every page into separate documents.',
    icon: 'Scissors',
    badge: '',
    category: 'Merge'
  },
  {
    id: 'rotate-pdf-pages',
    name: 'Rotate Pages',
    slug: 'rotate-pdf-pages',
    desc: 'Rotate PDF pages permanently 90, 180, or 270 degrees clockwise.',
    icon: 'RotateCw',
    badge: '',
    category: 'Other'
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    slug: 'pdf-to-jpg',
    desc: 'Convert PDF pages into high-resolution JPG or PNG images instantly.',
    icon: 'Image',
    badge: '',
    category: 'Convert from PDF'
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    slug: 'jpg-to-pdf',
    desc: 'Convert image files (JPG, PNG, WebP) into a beautiful unified PDF file.',
    icon: 'FileImage',
    badge: '',
    category: 'Convert to PDF'
  },
  {
    id: 'watermark-pdf',
    name: 'Watermark PDF',
    slug: 'watermark-pdf',
    desc: 'Add custom text or image watermarks to protect your documents.',
    icon: 'Stamp',
    badge: '',
    category: 'Edit & Sign'
  },
  {
    id: 'encrypt-pdf',
    name: 'Protect / Lock',
    slug: 'encrypt-pdf',
    desc: 'Protect PDF file with strong password and access permissions.',
    icon: 'Lock',
    badge: 'Security',
    category: 'Edit & Sign'
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    slug: 'unlock-pdf',
    desc: 'Remove restrictions and password protection from PDF files.',
    icon: 'Unlock',
    badge: 'Security',
    category: 'Edit & Sign'
  },
  {
    id: 'page-numbers-pdf',
    name: 'Page Numbers',
    slug: 'page-numbers-pdf',
    desc: 'Apply customizable page numbers, header, or footer labels.',
    icon: 'Hash',
    badge: '',
    category: 'Other'
  },
  {
    id: 'extract-text-from-pdf',
    name: 'PDF to Text',
    slug: 'extract-text-from-pdf',
    desc: 'Extract all selectable text from PDF documents for easy editing and copying.',
    icon: 'FileText',
    badge: '',
    category: 'Convert from PDF'
  },
  {
    id: 'flatten-pdf',
    name: 'Flatten PDF',
    slug: 'flatten-pdf',
    desc: 'Make fillable form fields and annotations permanent and read-only.',
    icon: 'FileCheck',
    badge: '',
    category: 'Edit & Sign'
  }
];

export const TOOL_CATEGORIES = [
  {
    name: 'Merge & Split',
    description: 'Combine, divide, extract and organize PDF pages',
    tools: [
      { id: 'merge-pdf', name: 'Merge PDF', desc: 'Combine multiple PDFs and images into one', slug: 'merge-pdf' },
      { id: 'split-pdf', name: 'Split PDF', desc: 'Split specific page ranges or extract pages', slug: 'split-pdf' },
      { id: 'organize-pdf', name: 'Organize Pages', desc: 'Arrange, sort and reorder PDF pages', slug: 'organize-pdf' },
      { id: 'extract-pdf-pages', name: 'Extract Pages', desc: 'Get a new document with only selected pages', slug: 'extract-pdf-pages' },
      { id: 'delete-pdf-pages', name: 'Delete Pages', desc: 'Remove pages visually from a PDF document', slug: 'delete-pdf-pages' },
      { id: 'alternate-mix-pdf', name: 'Alternate & Mix', desc: 'Mix pages alternating from 2 or more files', slug: 'alternate-mix-pdf' }
    ]
  },
  {
    name: 'Edit & Sign',
    description: 'Modify text, fill forms, stamp signatures and redact',
    tools: [
      { id: 'pdf-editor', name: 'PDF Editor', desc: 'Add text, shapes, whiteout, and images to PDF', slug: 'pdf-editor' },
      { id: 'sign-pdf', name: 'Fill & Sign', desc: 'Draw or type signature and fill form inputs', slug: 'sign-pdf' },
      { id: 'compress-pdf', name: 'Compress PDF', desc: 'Reduce file size while preserving high quality', slug: 'compress-pdf' },
      { id: 'watermark-pdf', name: 'Watermark', desc: 'Add text or logo watermark across all pages', slug: 'watermark-pdf' },
      { id: 'encrypt-pdf', name: 'Protect PDF', desc: 'Add password encryption to your PDF', slug: 'encrypt-pdf' },
      { id: 'unlock-pdf', name: 'Unlock PDF', desc: 'Remove passwords and permissions locks', slug: 'unlock-pdf' },
      { id: 'flatten-pdf', name: 'Flatten PDF', desc: 'Make interactive forms permanent and read-only', slug: 'flatten-pdf' }
    ]
  },
  {
    name: 'Convert from PDF',
    description: 'Turn your PDF documents into other popular file formats',
    tools: [
      { id: 'pdf-to-jpg', name: 'PDF to JPG', desc: 'Convert PDF pages into high quality images', slug: 'pdf-to-jpg' },
      { id: 'extract-text-from-pdf', name: 'PDF to Text', desc: 'Extract raw text to a plain TXT file', slug: 'extract-text-from-pdf' },
      { id: 'pdf-to-word', name: 'PDF to Word', desc: 'Convert PDF content into editable document format', slug: 'pdf-to-word' },
      { id: 'pdf-to-excel', name: 'PDF to Excel', desc: 'Extract tables and data into spreadsheet format', slug: 'pdf-to-excel' }
    ]
  },
  {
    name: 'Convert to PDF',
    description: 'Transform pictures, documents, and web pages into PDF',
    tools: [
      { id: 'jpg-to-pdf', name: 'JPG / Images to PDF', desc: 'Convert photo scans and pictures to PDF', slug: 'jpg-to-pdf' },
      { id: 'word-to-pdf', name: 'Word to PDF', desc: 'Create PDF documents from Word .docx files', slug: 'word-to-pdf' },
      { id: 'html-to-pdf', name: 'HTML to PDF', desc: 'Convert web pages and HTML files to PDF', slug: 'html-to-pdf' }
    ]
  },
  {
    name: 'Page & Layout',
    description: 'Crop margins, rotate, renumber, and adjust dimensions',
    tools: [
      { id: 'crop-pdf', name: 'Crop PDF', desc: 'Trim page margins and adjust boundary sizes', slug: 'crop-pdf' },
      { id: 'rotate-pdf-pages', name: 'Rotate PDF', desc: 'Rotate pages 90, 180, or 270 degrees', slug: 'rotate-pdf-pages' },
      { id: 'page-numbers-pdf', name: 'Page Numbers', desc: 'Add custom page numbering and headers', slug: 'page-numbers-pdf' },
      { id: 'header-footer-pdf', name: 'Header & Footer', desc: 'Add running headers, labels and titles', slug: 'header-footer-pdf' },
      { id: 'grayscale-pdf', name: 'Grayscale PDF', desc: 'Convert color PDFs into monochrome black & white', slug: 'grayscale-pdf' }
    ]
  }
];

export const HOW_TO_GUIDES = [
  {
    title: 'How to edit PDF files for free',
    desc: 'Upload your document to our PDF Editor. Click on the text tool to add or change text, draw freehand annotations, insert signatures, or whiteout sensitive information, then click Save and Download.',
    toolId: 'pdf-editor'
  },
  {
    title: 'How to combine multiple PDFs into one',
    desc: 'Select two or more PDF files. Drag and drop them to arrange them in the exact order you want. Click "Merge PDF" to produce a single continuous document instantly.',
    toolId: 'merge-pdf'
  },
  {
    title: 'How to compress a PDF without losing quality',
    desc: 'Upload your large PDF file. Choose from Recommended, Basic, or Strong compression settings. Our client-side optimizer strips redundant streams and compresses graphics.',
    toolId: 'compress-pdf'
  },
  {
    title: 'How to delete unwanted pages from a PDF',
    desc: 'Upload your PDF. You will see a visual preview grid of all pages. Simply hover and click the trash can icon on any page you want to remove, then click Apply Changes.',
    toolId: 'delete-pdf-pages'
  },
  {
    title: 'How to sign a PDF document online',
    desc: 'Upload your contract or form. Select "Sign" from the toolbar. You can draw your signature with your mouse or finger, or type your name. Position it on the line and download.',
    toolId: 'sign-pdf'
  },
  {
    title: 'How to convert PDF pages to JPG images',
    desc: 'Upload your PDF and click convert. Each page is rendered in crisp high definition as a JPG/PNG. Download individual pages or grab all pages in a convenient ZIP archive.',
    toolId: 'pdf-to-jpg'
  }
];

