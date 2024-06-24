import css from "./Copyright.module.css";
import Icon from "@/component/icon";
import { Copyright as CopyrightIcon } from "lucide-react";

function Copyright() {
    return (
        <aside className={css.container}>
            <address>
                <Icon label="copyright" width={12}>
                    <CopyrightIcon />
                </Icon>
                2022-2024 Jynxio | CC BY-NC-ND 4.0
            </address>
        </aside>
    );
}

export { Copyright };
export default Copyright;
