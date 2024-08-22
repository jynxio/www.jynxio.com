import css from "./layout.module.css";
import Copyright from "@/layout/copyright";

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className={css.container}>
            <section className={css.content}>{children}</section>
            <section className={css.copyright}>
                <Copyright />
            </section>
        </div>
    );
}

export default Layout;
