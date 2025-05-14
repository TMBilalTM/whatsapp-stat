from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import re
from collections import Counter, defaultdict
from datetime import datetime, timedelta
import calendar
import locale

# Türkçe dil ayarını yapılandır
try:
    locale.setlocale(locale.LC_ALL, 'tr_TR.UTF-8')
except:
    try:
        locale.setlocale(locale.LC_ALL, 'tr_TR')
    except:
        locale.setlocale(locale.LC_ALL, 'Turkish_Turkey.1254')  # Windows için

# Türkçe gün ve ay isimleri
TR_DAY_NAMES = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"]
TR_MONTH_NAMES = ["", "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", 
                  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def home():
    return jsonify({'message': 'Python backend çalışıyor!'})

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'error': 'Dosya bulunamadı!'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Dosya seçilmedi!'}), 400
    save_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(save_path)
    return jsonify({'message': 'Dosya başarıyla yüklendi!', 'filename': file.filename})

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    filename = data.get('filename')
    if not filename:
        return jsonify({'error': 'Dosya adı belirtilmedi!'}), 400
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(file_path):
        return jsonify({'error': 'Dosya bulunamadı!'}), 404
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # WhatsApp satır formatı: 12.05.2024, 22:15 - Kişi: Mesaj
    msg_pattern = re.compile(r"^\d{1,2}\.\d{1,2}\.\d{2,4},? \d{1,2}:\d{2} - (.*?): (.*)$")
    user_msg_count = Counter()
    user_apology_count = Counter()
    user_love_count = Counter()
    all_msgs = []

    for line in lines:
        match = msg_pattern.match(line)
        if match:
            user, msg = match.groups()
            user_msg_count[user] += 1
            all_msgs.append({'user': user, 'msg': msg})
            # Özür dileyenleri say
            if re.search(r'\bözür\b|pardon|affet|kusura bakma', msg, re.IGNORECASE):
                user_apology_count[user] += 1
            # Sevgi gösterenleri say
            if re.search(r'\b(seni seviyorum|canım|aşkım|kalp|<3|love|❤️|😘|😍)\b', msg, re.IGNORECASE):
                user_love_count[user] += 1

    most_active = user_msg_count.most_common(1)[0] if user_msg_count else (None, 0)
    most_apology = user_apology_count.most_common(1)[0] if user_apology_count else (None, 0)
    most_love = user_love_count.most_common(1)[0] if user_love_count else (None, 0)

    # Cevap süresi analizi (kimin daha geç cevap verdiği)
    user_last_time = defaultdict(lambda: None)
    user_response_times = defaultdict(list)
    time_pattern = re.compile(r"^(\d{1,2})\.(\d{1,2})\.(\d{2,4}),? (\d{1,2}):(\d{2}) - (.*?): (.*)$")
    prev_time = None
    prev_user = None
    for line in lines:
        match = time_pattern.match(line)
        if match:
            day, month, year, hour, minute, user, msg = match.groups()
            try:
                dt = datetime.strptime(f"{day}.{month}.{year} {hour}:{minute}", "%d.%m.%Y %H:%M")
            except ValueError:
                try:
                    dt = datetime.strptime(f"{day}.{month}.{year} {hour}:{minute}", "%d.%m.%y %H:%M")
                except ValueError:
                    continue
            if prev_user and user != prev_user:
                diff = (dt - prev_time).total_seconds()
                user_response_times[user].append(diff)
            prev_time = dt
            prev_user = user
    avg_response = {u: (sum(times)/len(times)) for u, times in user_response_times.items() if times}
    slowest = max(avg_response.items(), key=lambda x: x[1]) if avg_response else (None, 0)    # Zaman tabanlı analizler
    hour_activity = defaultdict(int)  # Saatlik aktivite
    day_activity = defaultdict(int)  # Günlük aktivite (Pazartesi, Salı...)
    date_activity = defaultdict(int)  # Tarih bazlı aktivite
    month_activity = defaultdict(int)  # Aylar bazlı aktivite
    
    # Kelime analizi
    word_counts = Counter()
    # Emoji analizi
    emoji_pattern = re.compile(r'[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF\U0001F700-\U0001F77F\U0001F780-\U0001F7FF\U0001F800-\U0001F8FF\U0001F900-\U0001F9FF\U0001FA00-\U0001FA6F\U0001FA70-\U0001FAFF\U00002702-\U000027B0\U000024C2-\U0001F251]+')
    emoji_counts = Counter()
    
    # Konuşma başlatıcıları
    conversation_starters = Counter()
    
    prev_dt = None
    prev_user = None
    
    for line in lines:
        match = time_pattern.match(line)
        if match:
            day, month, year, hour, minute, user, msg = match.groups()
            try:
                dt = datetime.strptime(f"{day}.{month}.{year} {hour}:{minute}", "%d.%m.%Y %H:%M")
            except ValueError:
                try:
                    dt = datetime.strptime(f"{day}.{month}.{year} {hour}:{minute}", "%d.%m.%y %H:%M")
                except ValueError:
                    continue
            
            # Saatlik aktivite analizi
            hour_activity[int(hour)] += 1
              # Haftanın günü analizi (0: Pazartesi, 6: Pazar)
            weekday = dt.weekday()
            day_name = TR_DAY_NAMES[weekday]  # Türkçe gün adı
            day_activity[day_name] += 1
            
            # Tarih bazlı analiz
            date_str = dt.strftime("%d.%m.%Y")
            date_activity[date_str] += 1
            
            # Ay bazlı analiz
            month_name = TR_MONTH_NAMES[dt.month]  # Türkçe ay adı
            month_activity[month_name] += 1
            
            # Konuşma başlatma analizi (3 saatten fazla sessizlik sonrası)
            if prev_dt and (dt - prev_dt).total_seconds() > 10800:
                conversation_starters[user] += 1
            
            # Kelime kullanım analizi
            words = re.findall(r'\b\w+\b', msg.lower())
            # Stop kelimeleri filtreleme (kısa kelimeler ve yaygın bağlaçlar)
            filtered_words = [word for word in words if len(word) > 3 and word not in ['evet', 'hayır', 'tamam']]
            word_counts.update(filtered_words)
            
            # Emoji analizi
            emojis = emoji_pattern.findall(msg)
            if emojis:
                emoji_counts.update(emojis)
            
            prev_dt = dt
            prev_user = user
    
    # Kelime analizi - sadece en çok kullanılan 15 kelime
    common_words = {word: count for word, count in word_counts.most_common(15)}
    
    # En aktif 10 gün
    top_active_days = {date: count for date, count in sorted(date_activity.items(), key=lambda x: x[1], reverse=True)[:10]}
      # En aktif 24 saat - Daha okunaklı saat formatı
    hourly_activity = {f"{h:02d}:00": hour_activity.get(h, 0) for h in range(24)}
      # En aktif aylar ve günler - Türkçe gün isimleri kullanarak
    weekday_activity = {day: day_activity.get(day, 0) for day in TR_DAY_NAMES}
    
    return jsonify({
        'total_messages': len(all_msgs),
        'most_active': {'user': most_active[0], 'count': most_active[1]},
        'most_apology': {'user': most_apology[0], 'count': most_apology[1]},
        'most_love': {'user': most_love[0], 'count': most_love[1]},
        'slowest': {'user': slowest[0], 'avg_seconds': slowest[1]},
        'user_msg_count': user_msg_count,
        'user_apology_count': user_apology_count,
        'user_love_count': user_love_count,
        'avg_response': avg_response,
        'hourly_activity': hourly_activity,
        'weekday_activity': weekday_activity,
        'month_activity': dict(month_activity),
        'top_active_days': top_active_days,
        'common_words': common_words,
        'emoji_counts': {e: c for e, c in emoji_counts.most_common(10)},
        'conversation_starters': dict(conversation_starters)
    })

if __name__ == '__main__':
    app.run(debug=True)
