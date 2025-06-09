const apikey = "AUWVMPQ88DK6R5SQ";

const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${apikey}`;

function formatDate(dateStr: string): string {
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  return `${day}/${month}/${year}`;
}

async function fetchNews() {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "fetch" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("🌐 Respuesta cruda de la API:", data);
    return data.feed; // Aquí podría estar fallando si data.feed no existe
  } catch (error) {
    console.error("❌ Error en fetchNews:", error);
    return null;
  }
}

async function getNews() {
  const news = await fetchNews();
  console.log("🧩 feed recibido en getNews:", news);
  if (news) {
    const formattedNews = news.map((item: any) => ({
      title: item.title,
      url: item.url,
      authors: item.authors,
      time_published: formatDate(item.time_published),
      summary: item.summary,
      source: item.source_domain,
      image: item.banner_image,
      tickers: item.tickers,
    }));
    return formattedNews;
  }

  return []; // <= asegúrate de retornar un array vacío si no hay datos
}

export { getNews };
