import { A as a } from './comps/a';
import { Blockquote as blockquote } from './comps/blockquote';
import { Br as br } from './comps/br';
import { Code as code } from './comps/code';
import { Em as em } from './comps/em';
import { H1 as h1 } from './comps/h1';
import { H2 as h2 } from './comps/h2';
import { Hr as hr } from './comps/hr';
import { Img as img } from './comps/img';
import { Li as li } from './comps/li';
import { Ol as ol } from './comps/ol';
import { P as p } from './comps/p';
import { Strong as strong } from './comps/strong';
import { Table as table } from './comps/table';
import { Ul as ul } from './comps/ul';

const mdx = {
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

export { mdx };
