import { redirect } from 'next/navigation';

export async function GET(
  request: Request,
  { params }: { params: { video: string } }
) {
  const { video } = params;
  redirect(`https://admin.bywharf.com/uploads/${video}`);
}
