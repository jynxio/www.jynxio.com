import css from './index.module.css';
import MousePosition from './mouse-position';

function Mdx() {
    return (
        <div className={css.container}>
            <section>
                <div>
                    <h2>{'## How to use JSX in Markdown'}</h2>
                    <p>{'<MousePosition />'}</p>
                </div>
            </section>

            <section>
                <div>
                    <h2>{'How to use JSX in Markdown'}</h2>
                    <MousePosition />
                </div>
            </section>
        </div>
    );
}

export { Mdx };
export default Mdx;
