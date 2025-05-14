import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const TR_DAY_NAMES = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const TR_MONTH_NAMES = ["", "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

function countWords(msg: string) {
  return (msg.toLowerCase().match(/\b\w+\b/g) || []).filter(word => word.length > 3 && !['evet','hayır','tamam'].includes(word));
}

function findEmojis(msg: string) {
  return (msg.match(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2702}-\u{27B0}\u{24C2}-\u{1F251}]+/gu) || []);
}

export async function POST(req: NextRequest) {
  const { filename } = await req.json();
  if (!filename) return NextResponse.json({ error: 'Dosya adı belirtilmedi!' }, { status: 400 });
  const filePath = path.join(process.cwd(), 'uploads', filename);
  let lines: string[];
  try {
    // Dosya var mı kontrolü
    await fs.access(filePath);
    const file = await fs.readFile(filePath, 'utf-8');
    lines = file.split(/\r?\n/);
  } catch (e) {
    return NextResponse.json({ error: 'Dosya bulunamadı veya okunamadı!', detail: e instanceof Error ? e.message : e }, { status: 404 });
  }

  // Sayaçlar
  const user_msg_count: Record<string, number> = {};
  const user_apology_count: Record<string, number> = {};
  const user_love_count: Record<string, number> = {};
  const all_msgs: {user: string, msg: string}[] = [];
  const user_response_times: Record<string, number[]> = {};
  let prev_time: Date|null = null;
  let prev_user: string|null = null;

  // Zaman analizleri
  const hour_activity: Record<number, number> = {};
  const day_activity: Record<string, number> = {};
  const date_activity: Record<string, number> = {};
  const month_activity: Record<string, number> = {};
  const word_counts: Record<string, number> = {};
  const emoji_counts: Record<string, number> = {};
  const conversation_starters: Record<string, number> = {};
  let prev_dt: Date|null = null;

  for (const line of lines) {
    const match = line.match(/^(\d{1,2})\.(\d{1,2})\.(\d{2,4}),? (\d{1,2}):(\d{2}) - (.*?): (.*)$/);
    if (match) {
      const [, day, month, year, hour, minute, user, msg] = match;
      let dt: Date;
      try {
        dt = new Date(`${year.length === 2 ? '20'+year : year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}T${hour.padStart(2,'0')}:${minute.padStart(2,'0')}:00`);
      } catch { continue; }
      // Mesaj sayacı
      user_msg_count[user] = (user_msg_count[user] || 0) + 1;
      all_msgs.push({ user, msg });
      // Özür
      if (/(özür|pardon|affet|kusura bakma)/i.test(msg)) user_apology_count[user] = (user_apology_count[user] || 0) + 1;
      // Sevgi
      if (/(seni seviyorum|canım|aşkım|kalp|<3|love|❤️|😘|😍)/i.test(msg)) user_love_count[user] = (user_love_count[user] || 0) + 1;
      // Cevap süresi
      if (prev_user && user !== prev_user && prev_time) {
        const diff = (dt.getTime() - prev_time.getTime()) / 1000;
        if (!user_response_times[user]) user_response_times[user] = [];
        user_response_times[user].push(diff);
      }
      prev_time = dt;
      prev_user = user;
      // Saatlik aktivite
      hour_activity[parseInt(hour)] = (hour_activity[parseInt(hour)] || 0) + 1;
      // Günlük aktivite
      const weekday = dt.getDay() === 0 ? 6 : dt.getDay() - 1;
      const day_name = TR_DAY_NAMES[weekday];
      day_activity[day_name] = (day_activity[day_name] || 0) + 1;
      // Tarih bazlı
      const date_str = `${day.padStart(2,'0')}.${month.padStart(2,'0')}.${year.length === 2 ? '20'+year : year}`;
      date_activity[date_str] = (date_activity[date_str] || 0) + 1;
      // Ay bazlı
      const month_name = TR_MONTH_NAMES[parseInt(month)];
      month_activity[month_name] = (month_activity[month_name] || 0) + 1;
      // Konuşma başlatıcı
      if (prev_dt && (dt.getTime() - prev_dt.getTime()) > 10800 * 1000) {
        conversation_starters[user] = (conversation_starters[user] || 0) + 1;
      }
      // Kelime analizi
      for (const word of countWords(msg)) {
        word_counts[word] = (word_counts[word] || 0) + 1;
      }
      // Emoji analizi
      for (const emoji of findEmojis(msg)) {
        emoji_counts[emoji] = (emoji_counts[emoji] || 0) + 1;
      }
      prev_dt = dt;
    }
  }

  // Sonuçlar
  const most_active = Object.entries(user_msg_count).sort((a,b)=>b[1]-a[1])[0] || [null,0];
  const most_apology = Object.entries(user_apology_count).sort((a,b)=>b[1]-a[1])[0] || [null,0];
  const most_love = Object.entries(user_love_count).sort((a,b)=>b[1]-a[1])[0] || [null,0];
  const avg_response: Record<string, number> = {};
  for (const u in user_response_times) {
    const arr = user_response_times[u];
    avg_response[u] = arr.reduce((a,b)=>a+b,0)/arr.length;
  }
  const slowest = Object.entries(avg_response).sort((a,b)=>b[1]-a[1])[0] || [null,0];
  const common_words = Object.entries(word_counts).sort((a,b)=>b[1]-a[1]).slice(0,15).reduce((acc,[w,c])=>(acc[w]=c,acc),{} as Record<string,number>);
  const top_active_days = Object.entries(date_activity).sort((a,b)=>b[1]-a[1]).slice(0,10).reduce((acc,[d,c])=>(acc[d]=c,acc),{} as Record<string,number>);
  const hourly_activity = Array.from({length:24},(_,h)=>h).reduce((acc,h)=>{acc[`${h.toString().padStart(2,'0')}:00`]=hour_activity[h]||0;return acc;},{} as Record<string,number>);
  const weekday_activity = TR_DAY_NAMES.reduce((acc,day)=>(acc[day]=day_activity[day]||0,acc),{} as Record<string,number>);
  const emoji_counts_sorted = Object.entries(emoji_counts).sort((a,b)=>b[1]-a[1]).slice(0,10).reduce((acc,[e,c])=>(acc[e]=c,acc),{} as Record<string,number>);

  return NextResponse.json({
    total_messages: all_msgs.length,
    most_active: { user: most_active[0], count: most_active[1] },
    most_apology: { user: most_apology[0], count: most_apology[1] },
    most_love: { user: most_love[0], count: most_love[1] },
    slowest: { user: slowest[0], avg_seconds: slowest[1] },
    user_msg_count,
    user_apology_count,
    user_love_count,
    avg_response,
    hourly_activity,
    weekday_activity,
    month_activity,
    top_active_days,
    common_words,
    emoji_counts: emoji_counts_sorted,
    conversation_starters
  });
}
