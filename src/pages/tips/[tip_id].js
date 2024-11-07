import { useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/FullTipPage.module.css";
import { tips, users } from "@/data/loadData";

export default function FullTipPage() {
    const router = useRouter();
    const { tipId } = router.query;

    const tip = tipId ? tips.find(t => t.id === parseInt(tipId, 10)) : null;

    if (!tip) {
        return <div>Tip not found!</div>;
    }

    return (
        <div className={styles.fullTipPage}>
            <h1 className={styles.fullTipHeader}>{tip.shortDescription}</h1>
            {users[tip.postedBy] ? (
                <span>{`Posted by: ${users[tip.postedBy].user_name} on ${tip.postedDate}`}</span>
            ) : (
                <span>User not found</span>
            )}
            <div className={styles.fullTipContent}>
                <p className={styles.fullTipDescription}>{tip.content}</p>
                <div className={styles.fullTipDetails}></div>
            </div>
        </div>
    );
}