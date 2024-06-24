import css from "./layout.module.css";
import ScrollbarWrapper from "@/component/scrollbar-wrapper";

function Layout({ children }: { children: React.ReactNode }) {
    return <ScrollbarWrapper className={css.wrapper}>{children}</ScrollbarWrapper>;
}

export default Layout;
