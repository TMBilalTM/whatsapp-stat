<h1 align="center">WhatsApp Sohbet Analiz Sistemi</h1>
<p align="center"><b>Developed By BilalTM</b></p>

<p align="center">
  <img src="public/window.svg" width="120" alt="Logo" />
</p>

WhatsApp sohbetlerinizi yükleyerek detaylı analiz ve istatistikler elde edin. Modern Next.js (TypeScript), Tailwind CSS ve Python (Flask) backend ile geliştirilmiştir.

---

## 🚀 Özellikler
- 📁 WhatsApp .txt sohbet dosyası yükleme
- 📊 Kişi bazlı mesaj, cevap süresi, duygu analizi ve daha fazlası
- 🌙 Modern ve minimalist arayüz (Tailwind CSS)
- 🐍 Python (Flask) ile hızlı ve güvenli analiz

---

## ⚡️ Hızlı Başlangıç

### 1. Depoyu Klonlayın
```sh
git clone https://github.com/TMBilalTM/whatsapp-sohbet-analiz.git
cd whatsapp-sohbet-analiz
```

### 2. Frontend Kurulumu (Next.js)
```sh
npm install
```

### 3. Backend Kurulumu (Flask)
```sh
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install flask flask-cors
```

### 4. Uygulamayı Başlatın
#### Backend:
```sh
cd backend
.\venv\Scripts\activate
python app.py
```
#### Frontend:
```sh
npm run dev
```

### 5. Tarayıcıda Açın
[http://localhost:3000](http://localhost:3000)

---

## 🛠️ Kullanım
1. WhatsApp sohbetinizi .txt formatında dışa aktarın.
2. Ana sayfadan dosyanızı yükleyin.
3. Analiz sonuçlarını ve istatistikleri modern grafiklerle görüntüleyin.

---

## 📂 Proje Yapısı
```
analiz/
├── backend/           # Flask backend
│   └── app.py
├── public/            # Statik dosyalar ve ikonlar
├── src/app/           # Next.js frontend kodları
│   └── ...
├── package.json       # Next.js bağımlılıkları
└── README.md
```

---

## 💡 Katkı Sağlama
Pull request'ler ve öneriler memnuniyetle karşılanır!

---

<p align="center"><b>Developed By BilalTM</b></p>

## 📝 Lisans
MIT
