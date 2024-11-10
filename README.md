# Dobby - AI Assistant Builder

Dobby adds a touch of magic to building custom AI assistants—no technical skills needed. Just tell what you want in simple language, and see instant results in the live assistant. Once ready, your AI can be published to the web, making sharing as easy as a flick of the wand.

## Features

- **No-Code Assistant Creation**: Build AI assistants using natural language instructions
- **Real-Time Preview**: See immediate results as you shape your assistant's behavior
- **Web Publishing**: Deploy your assistant directly to the web with one click
- **Custom Instructions**: Fine-tune your assistant's responses and personality
- **File Attachments**: Support for image attachments and file uploads

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn package manager

Here’s the markdown with syntax corrections:

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/dobby.git
    cd dobby
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set environment variables:

    ```env
    LANGGRAPH_API_URL=your_langgraph_api_url
    LANGCHAIN_API_KEY=your_langchain_api_key
    ```

4. Run the development server:

    ```bash
    npm run dev
    ```

5. Deploy using Google Cloud Run:

    ```bash
    gcloud run deploy assistant-builder --source . --port 3000 --env-vars-file .env.gcp.yaml --allow-unauthenticated --region europe-west1 --min-instances 1
    ```

### Project Structure

```bash
.
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── assistant/        # Assistant pages
│   └── providers/        # React context providers
├── components/           # React components
│   ├── tools/            # Assistant tools
│   └── ui/               # UI components
├── lib/                  # Utility functions
└── public/               # Static assets
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
