import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { filename } = await req.json();
    if (!filename) return NextResponse.json({ error: 'Dosya adı belirtilmedi!' }, { status: 400 });

    // Not: Vercel Edge'de dosya sistemi erişimi olmadığı için,
    // upload yapılan dosyalar için önbellek kaydı kullanıyoruz
    // Her dosya zaten upload'da tam olarak işleniyor
    return NextResponse.json({ error: 'Bu sunucuda dosya sistemi desteği bulunmamaktadır. Lütfen dosyayı tekrar yükleyiniz.' }, { status: 400 });
  } catch (error) {
    console.error("Analiz hatası:", error);
    return NextResponse.json({ error: 'İstek işlenirken bir hata oluştu. Lütfen tekrar deneyiniz.' }, { status: 500 });
  }
}
