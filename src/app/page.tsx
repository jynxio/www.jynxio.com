import css from './page.module.css';
import React from 'react';

async function Home() {
    return <h1 className={css.container}>{"✨ Jynxio's brand new blog ✨"}</h1>;
}

export default Home;
