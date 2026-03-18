import { redirect } from 'next/navigation'

export async function GET(
  request: Request,
  { params }: { params: { video: string } }
) {
  redirect(`https://admin.bywharf.com/uploads/${params.video}`)
}
