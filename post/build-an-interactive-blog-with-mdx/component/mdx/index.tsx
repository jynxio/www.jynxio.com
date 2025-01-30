import css from './index.module.css';
import MousePosition from './mouse-position';

function Mdx() {
    return (
        <div className={css.container}>
            <section>
                <h2>{'## How to use JSX in Markdown'}</h2>
                <p>{'<MousePosition />'}</p>
            </section>

            <section>
                <h2>{'How to use JSX in Markdown'}</h2>
                <MousePosition />
            </section>
        </div>
    );
}

export { Mdx };
export default Mdx;
