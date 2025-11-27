import styles from './Detail.module.css';

export default function AboutSection() {
    return (
        <div className="lg:w-2/3 m-auto 
        mt-20
        border border-black ">
            <div className={styles.title}>About.</div>
            <div className={styles.description}>
                Degined to sense.  Built to enhance your well-being. <br />
                Where posture intelligence meets desktop minimalism.
            </div>
        </div>
    );
}