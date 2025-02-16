import a from './component/a';
import blockquote from './component/blockquote';
import br from './component/br';
import code from './component/code';
import em from './component/em';
import h1 from './component/h1';
import h2 from './component/h2';
import hr from './component/hr';
import img from './component/img';
import li from './component/li';
import ol from './component/ol';
import p from './component/p';
import strong from './component/strong';
import table from './component/table';
import ul from './component/ul';

const comp = {
    a,
    blockquote,
    br,
    code,
    em,
    h1,
    h2,
    h3: h1,
    h4: h1,
    h5: h1,
    h6: h1,
    hr,
    img,
    li,
    ol,
    p,
    strong,
    table,
    ul,
} as const;

export default comp;
