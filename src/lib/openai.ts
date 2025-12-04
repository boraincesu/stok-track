import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateProductDescription(
  name: string,
  category: string
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Sen şirket içi envanter yönetim asistanısın. Ürünler için kısa iç notlar yaz. Satış açıklaması YAZMA. Sadece şirket içinde bu ürünün nerelerde/nasıl kullanıldığına dair 1-2 kısa cümle yaz. Teknik tanım yapma, pratik kullanım bilgisi ver.",
      },
      {
        role: "user",
        content: `Ürün: ${name}\nKategori: ${category}\n\nBu malzeme şirket içinde nerelerde kullanılıyor olabilir? Kısa dipnot şeklinde yaz.`,
      },
    ],
    max_tokens: 80,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || "";
}

export async function summarizeReport(data: {
  totalProducts: number;
  totalStock: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalStockValue: number;
  topCategories: string[];
}): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Sen bir stok yönetim asistanısın. Verilen stok verilerini analiz edip Türkçe olarak kısa ve öz bir özet hazırla. Önemli noktaları vurgula ve varsa önerilerde bulun.",
      },
      {
        role: "user",
        content: `Stok Özeti:
- Toplam Ürün Sayısı: ${data.totalProducts}
- Toplam Stok Miktarı: ${data.totalStock} adet
- Düşük Stok Uyarısı: ${data.lowStockCount} ürün
- Stokta Olmayan: ${data.outOfStockCount} ürün
- Toplam Stok Değeri: $${data.totalStockValue.toLocaleString()}
- En Yoğun Kategoriler: ${data.topCategories.join(", ")}

Bu verileri analiz edip kısa bir özet ve öneriler sun.`,
      },
    ],
    max_tokens: 300,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || "";
}

export async function generateSupplierEmail(data: {
  productName: string;
  quantity: number;
  supplierName?: string;
  currentStock: number;
  unit: string;
}): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Sen profesyonel bir satın alma uzmanısın. Tedarikçilere gönderilecek sipariş e-postaları yazıyorsun. E-postalar resmi, net ve profesyonel Türkçe ile yazılmalı.",
      },
      {
        role: "user",
        content: `Aşağıdaki ürün için tedarikçiye sipariş e-postası yaz:

Ürün: ${data.productName}
Sipariş Miktarı: ${data.quantity} ${data.unit}
Mevcut Stok: ${data.currentStock} ${data.unit}
Tedarikçi: ${data.supplierName || "Sayın Yetkili"}

E-posta profesyonel ve sipariş amaçlı olmalı. Konu satırı ve e-posta gövdesini ayrı yaz.`,
      },
    ],
    max_tokens: 400,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || "";
}

export default openai;
