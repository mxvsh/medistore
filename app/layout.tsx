import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Providers from '#/lib/providers';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600'] });

export const metadata: Metadata = {
	title: 'medistore',
	description: 'Medistore is a medical medicine calculator.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={poppins.className}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
