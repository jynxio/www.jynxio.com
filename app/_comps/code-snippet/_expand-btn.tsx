import { Button } from '@/_comps/button';
import { Maximize } from 'lucide-react';
import css from './_btn.module.css';

function ExpandBtn() {
    return (
        <Button label="expand" className={css.expandBtn}>
            <Maximize />
        </Button>
    );
}

export { ExpandBtn };
