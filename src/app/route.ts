import { redirect } from 'next/navigation';

const dynamic = 'force-static';

async function GET() {
    return redirect('/posts');
}

export { dynamic, GET };
