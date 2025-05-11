const apikey = 'AUWVMPQ88DK6R5SQ';

const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${apikey}`;

async function fetchNews() {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': 'fetch' }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.feed;
  } catch (error) {
    console.error('Error:', error);
    return null; // Return null or handle the error appropriately
  }
}

function formatDate(date: string) {
  // Extract the date part
  const datePart = date.substring(0, 8); // "20250304"

  // Format it as DD/MM/YYYY
  const formattedDate = `${datePart.substring(6, 8)}/${datePart.substring(4, 6)}/${datePart.substring(0, 4)}`;

  return formattedDate; 

}

async function getNews() {
    const news = await fetchNews();
    if (news) {
        const formattedNews = news.map((item: any) => ({
            title: item.title,
            url: item.url,
            authors: item.authors,
            time_published: formatDate(item.time_published),
            summary: item.summary,
            source: item.source_domain,
            image: item.banner_image,
            tickers: item.tickers
        }));
        return formattedNews;
    }
}