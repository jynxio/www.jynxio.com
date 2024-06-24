import css from "./page.module.css";
import Bio from "@/layout/bio";
import Hero from "@/layout/hero";

function Page() {
    return (
        <main className={css.container}>
            <Bio />
            <Hero />
        </main>
    );
}

export default Page;
