import '@/styles/global.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>EduVerse</title>
                <link rel="icon" href="../public/favicon.ico" />    q
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
                    integrity="sha384-k6RqeWeci5ZR/Lv4MR0sA0FfDOM3K5FkdAN8fGE7rGjtNNmOmbrENZdLEZoepfN"
                    crossOrigin="anonymous"
                />
            </Head>
            <Component {...pageProps} />
        </>
    );
}