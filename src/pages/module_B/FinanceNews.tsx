import React, { useEffect, useState } from "react";
import Header from "../../components/layout/header/Header";
import Button from "../../components/ui/button/Button";
import { getNews } from "../../services/api/news_api";
import "./FinanceNews.css";

type RawNewsItem = {
  title: string;
  summary: string;
  image: string;
  time_published: string;
  url: string;
};

const FinanceNews: React.FC = () => {
  const [news, setNews] = useState<RawNewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const result = await getNews();

        if (result) {
          const formatted = result.map((item: any) => ({
            title: item.title,
            summary: item.summary,
            image: item.image,
            time_published: item.time_published,
            url: item.url,
          }));

          // Ordenar por fecha descendente
          formatted.sort((a, b) => {
            const [dayA, monthA, yearA] = a.time_published
              .split("/")
              .map(Number);
            const [dayB, monthB, yearB] = b.time_published
              .split("/")
              .map(Number);
            const dateA = new Date(yearA, monthA - 1, dayA);
            const dateB = new Date(yearB, monthB - 1, dayB);
            return dateB.getTime() - dateA.getTime();
          });

          setNews(formatted);
        }
      } catch (error) {
        console.error("Error al obtener noticias:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <>
      <Header />
      <div className="news-section">
        <h1 className="news-section__title">Actualidad Financiera</h1>
        <div className="news-grid">
          {news.map((item, index) => (
            <div key={index} className="news-card">
              <img
                src={item.image}
                alt={item.title}
                className="news-card__image"
              />
              <div className="news-card__body">
                <p className="news-card__date">{item.time_published}</p>
                <h2 className="news-card__headline">{item.title}</h2>
                <p className="news-card__summary">{item.summary}</p>
                <Button
                  label="Leer artículo"
                  onClick={() => window.open(item.url, "_blank")}
                  isDisabled={false}
                  isFilter={false}
                  variant="primary"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FinanceNews;
