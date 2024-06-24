import css from "./page.module.css";
import Link from "@/component/link";
import Icon from "@/component/icon";
import { reqList } from "@/helper/post";
import { Forward } from "lucide-react";

async function Blog() {
    const list = await reqList();

    return (
        <main className={css.container}>
            <ul className={css.list}>
                {list.map((item) => (
                    <li key={item.slug} className={css.post}>
                        <Link href={`/post/${item.slug}`} className={css.title}>
                            <h3>{item.title}</h3>
                        </Link>

                        <p className={css.description}>{item.abstract}</p>

                        <Link className={css.entry} href={`/post/${item.slug}`}>
                            Read now
                            <Icon label="read now" width={18}>
                                <Forward />
                            </Icon>
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}

export default Blog;
