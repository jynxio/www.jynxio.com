import css from "./page.module.css";
import Hero from "@/layout/hero";

function Page() {
    return (
        <main className={css.container}>
            <Hero />
        </main>
    );
}

export default Page;
