// app/layout.tsx

import { AppProvider } from '@toolpad/core/nextjs';

export default function Layout(props:any) {
    const { children } = props;

    return (
        <html lang="en">
        <body>
        <AppProvider>{children}</AppProvider>
        </body>
        </html>
    );
}