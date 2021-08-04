import React from 'react';
import { useParams } from 'react-router-dom';
import { IParams } from './utils/TypeScript';
import NotFound from './components/global/NotFound';


const generatePage = (name: string) => {
    const component = () => require(`./pages/${name}`).default;

    try {
        return React.createElement(component());
    } catch (err) {
        return <NotFound />;
    }
}


const PageRender = () => {
    const { page, slug }: IParams = useParams();
    // console.log(page, slug);

    let name = '';

    if (page) {
        const slugs = slug ? `${page}/[slug]` : `${page}`;
        name = slugs;
    }

    return generatePage(name);
}

export default PageRender
