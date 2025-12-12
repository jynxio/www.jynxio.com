import { redirect } from 'next/navigation';

export const dynamic = 'force-static';

function Page() {
    redirect('/posts');

    return null;
}

export default Page;
