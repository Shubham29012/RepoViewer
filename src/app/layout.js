import './globals.css'

export const metadata = {
  title: 'GitHub Repository Viewer',
  description: 'View GitHub repositories for any user',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}