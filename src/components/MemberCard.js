import React from "react";
import styles from '@/styles/MemberCard.module.css';

export default function MemberCard({ name }) {
    return (
        <div className={styles.memberCard}>
            <div className={styles.memberAvatar}>
                <span>{name.charAt(0)}</span> 
            </div>
            <div className={styles.memberName}>{name}</div>
        </div>
    );
}