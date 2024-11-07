import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/ErrorPage.module.css';

export default function Custom404() {
    return (
        <div className={styles.errorContainer}>
            <Image
                src="/assets/404.webp"
                alt="Page not found illustration"
                width={500}
                height={300}
                className={styles.errorImage}
            />
        </div>
    );
}