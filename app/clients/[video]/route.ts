import { redirect } from 'next/navigation';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ video: string }> }
) {
  const { video } = await params;
  redirect(`https://admin.bywharf.com/uploads/${video}`);
}
