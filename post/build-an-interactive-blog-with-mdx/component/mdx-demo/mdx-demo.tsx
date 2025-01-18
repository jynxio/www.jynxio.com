import css from './mdx-demo.module.css';
import MousePosition from './mouse-position';

function CustomJsx() {
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

export { CustomJsx };
export default CustomJsx;
