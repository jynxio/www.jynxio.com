import { redirect } from 'next/navigation';

const dynamic = 'force-static';

function Page() {
    redirect('/posts');

    return null;
}

export { dynamic };
export default Page;
