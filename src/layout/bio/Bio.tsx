import css from "./Bio.module.css";
import HeartWithLove from "./HeartWithLove";

function Bio() {
    return (
        <h1 className={css.container}>
            Craft web with mad
            <HeartWithLove height={16 * 4.5} />
        </h1>
    );
}

export { Bio };
export default Bio;
