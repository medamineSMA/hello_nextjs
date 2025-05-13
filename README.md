# API Dashboard

A modern, secure API key management dashboard built with Next.js and Supabase. This application provides a user-friendly interface for managing API keys, monitoring usage, and configuring application settings.

## Features

- 🔐 Secure API key management
- 📊 Usage analytics and monitoring
- 👤 User profile management
- ⚙️ Customizable settings
- 🎨 Modern, responsive UI
- 🔒 Supabase authentication
- 📱 Mobile-friendly design

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org)
- **Database:** [Supabase](https://supabase.com)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Icons:** [React Icons](https://react-icons.github.io/react-icons)
- **Authentication:** Supabase Auth

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/medamineSMA/hello_nextjs.git
cd hello_nextjs
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication pages
│   └── layout.js         # Root layout
├── components/            # Reusable components
├── contexts/             # React contexts
└── styles/               # Global styles
```

## Deployment

### Vercel Deployment
The easiest way to deploy this application is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository to Vercel
3. Configure environment variables
4. Deploy

### Manual Deployment
For manual deployment:

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Med** - [GitHub](https://github.com/medamineSMA)

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)