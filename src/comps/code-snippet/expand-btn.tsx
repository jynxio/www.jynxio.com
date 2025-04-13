import { Button } from '@/comps/button';
import { Maximize } from 'lucide-react';
import css from './btn.module.css';

function ExpandBtn() {
    return (
        <Button label="expand" className={css.expandBtn}>
            <Maximize />
        </Button>
    );
}

export { ExpandBtn };
