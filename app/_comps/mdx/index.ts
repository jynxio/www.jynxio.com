import { A as a } from './_comps/a';
import { Blockquote as blockquote } from './_comps/blockquote';
import { Br as br } from './_comps/br';
import { Code as code } from './_comps/code';
import { Em as em } from './_comps/em';
import { H1 as h1 } from './_comps/h1';
import { H2 as h2 } from './_comps/h2';
import { Hr as hr } from './_comps/hr';
import { Img as img } from './_comps/img';
import { Li as li } from './_comps/li';
import { Ol as ol } from './_comps/ol';
import { P as p } from './_comps/p';
import { Strong as strong } from './_comps/strong';
import { Table as table } from './_comps/table';
import { Ul as ul } from './_comps/ul';

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
