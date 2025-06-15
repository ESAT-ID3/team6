import './MarketStats.css'
import { useEffect, useState, useRef } from "react";
import Header from "../../components/layout/header/Header";
import assetService from "../../services/firebase/assetService";
import Button from '../../components/ui/button/Button';
import DropdownMenu from '../../components/ui/dropdownMenu/DropdownMenu';
import DatepickerMS from '../../components/ui/datepicker/DatepickerMS';
import TimeSeriesChart from '../../components/ui/charts/TimeSeriesChart';

const assetType = {
    "Acciones": "Stocks",
    "Criptomonedas": "Cryptocurrencies",
    "ETFs": "ETFs",
    "Divisas": "Forex"
};

const intervals = {
  "1 mes": "1month",
  "1 semana": "1week",
  "1 día": "1day",
  "4 horas": "4h",
};

const MarketStats = () => {
    let filterContent : string[] = ["Todos"]
    filterContent = [...filterContent, ...Object.keys(assetType)]
    const [selectedFilter, setSelectedFilter] = useState<string>("Todos")
    const [assetList, setAssetList] = useState<{name: string, type:string}[]>([]);

    const [assetName, setAssetName] = useState<string>("")
    const [selectedAsset, setSelectedAsset] = useState<any>(null)
    const [selectedType, setSelectedType] = useState<any>(null)

    const [requestType, setRequestType] = useState("")
    const [selectedInterval, setSelectedInterval] = useState("")
    const [selectedSymbol, setSelectedSymbol] = useState("")
    const [selectedExchange, setSelectedExchange] = useState("")
    const [selectedExchangeCategory, setSelectedExchangeCategory] = useState("")

    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")

    const intervalList = ["1 mes", "1 semana", "1 día", "4 horas"]
    const [exchangeCategory, setExchangeCategory] = useState<string[]>([])
    const [exchange, setExchange] = useState<string[]>([])

    const [datetimeList, setDateTimeList] = useState<string[]>([])
    const [openData, setOpenData] = useState<Number[]>([])
    const [closedData, setClosedData] = useState<Number[]>([])
    const [highData, setHighData] = useState<Number[]>([])
    const [lowData, setLowData] = useState<Number[]>([])

    // Referencias para scroll
    const mainRef = useRef<HTMLElement>(null)
    const topRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const fetchAllData = async () => {
          const keys = Object.keys(assetType) as (keyof typeof assetType)[];
          const promises = keys.map(key =>
              assetService.getFirebaseData(assetType[key])
          );
          const results = await Promise.all(promises);
          const formattedAssets = [
              ...assetService.formatStockData(results),
              ...assetService.formatCryptoData(results),
              ...assetService.formatETFData(results),
              ...assetService.formatForexData(results)
          ];

          setAssetList(formattedAssets);
      };

      fetchAllData();
    }, []);

    const applyFilters = (filter : string) => {
        setSelectedFilter(filter)
    }

    const setChartData = async (name : string, type : string) => {
        setExchangeCategory([])
        setExchange([])

        setSelectedInterval("") 
        setRequestType("") 
        setSelectedSymbol("") 
        setSelectedExchange("") 
        setSelectedExchangeCategory("") 
        setStartDate("") 
        setEndDate("")

        setDateTimeList([])
        setOpenData([])
        setClosedData([])
        setHighData([])
        setLowData([])

        let data = await assetService.getFirebaseData(assetType[type as keyof typeof assetType])
        if (data) {
            setAssetName(name)
            let asset = data[name as keyof typeof assetType]
            setSelectedAsset(asset)
            setSelectedType(type)
            updateRequestType(type)
            switch(type){
                case "Acciones":
                    setExchange(asset.exchanges)
                    break
                case "Divisas":
                    setExchangeCategory(Object.keys(asset))
                    break
                case "ETFs":
                    setSelectedSymbol(asset.metadata.symbol)
                    setSelectedExchange(asset.metadata.exchange)
                    break
                default:
                    setSelectedSymbol(asset.symbol)
                    break
            }
        }

        // Scroll suave hacia main (dashboard)
        if (mainRef.current) {
          mainRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const disableUpdateButton = () => {
        let result = selectedInterval === "" || startDate === "" || endDate === "" || selectedSymbol === ""
        if (selectedType === "Acciones" || selectedType === "ETFs") {
            result = result || requestType === "" || selectedExchange === ""
        }
        return result
    }

    const formatAndRequest = () => {
        const interval = intervals[selectedInterval as keyof typeof intervals];
        const firstDate = formatDateToApiString(new Date(startDate));
        const lastDate = formatDateToApiString(new Date(endDate));

        assetService.getMarketData(interval, requestType, selectedSymbol, selectedExchange, firstDate, lastDate)
            .then((data: any[]) => {
                const dateTimeList = data.map(item => item.datetime);
                const openDataList = data.map(item => Number(item.open));
                const closedDataList = data.map(item => Number(item.close));
                const highDataList = data.map(item => Number(item.high));
                const lowDataList = data.map(item => Number(item.low));

                setDateTimeList(dateTimeList);
                setOpenData(openDataList);
                setClosedData(closedDataList);
                setHighData(highDataList);
                setLowData(lowDataList);
            })
            .catch((error: any) => {
                console.error("Error al obtener datos del mercado:", error);
            });
    };

    function formatDateToApiString(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day} 00:00:00`;
    }

    const updateRequestType = (type : string) => {
        if (type === "Acciones") {
            setRequestType("stock")
        } else if(type === "ETFs") {
            setRequestType("etf")
        } else {
            setRequestType("")
        }
    }

    const scrollToTop = () => {
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }

    return (
    <>
        <Header />
        <div ref={topRef} className="ms-page-container">
          <div className="scroll-links" style={{display: 'none'}}>
            {/* Estos links los escondemos porque usaremos los botones */}
            <a href="#chart-section">Ver gráficos ↓</a>
            <a href="#asset-list">Volver arriba ↑</a>
          </div>
          <div className="ms-page-content">
            <aside id="asset-list">
              <h4>Mercado financiero</h4>
              <div className="ms-asset-filters">
                  {filterContent.map((filter) => (
                  <Button
                      key={filter}
                      label={filter}
                      isDisabled={false}
                      isFilter={true}
                      variant="secondary"
                      isActive={selectedFilter === filter}
                      onClick={() => applyFilters(filter)}
                  />
                  ))}
              </div>
              <div className="ms-asset-list">
                  {assetList
                  .filter(asset => selectedFilter === "Todos" || asset.type === selectedFilter)
                  .map((asset) => (
                      <div className="ms-asset-list__item" key={asset.name}>
                      <p>{asset.name}</p>
                      <Button 
                        label="Ver en dashboard" 
                        isDisabled={false} 
                        isFilter={false} 
                        variant="primary" 
                        onClick={() => setChartData(asset.name, asset.type)} 
                      />
                      </div>
                  ))}
              </div>
            </aside>
            <main ref={mainRef} id="chart-section" className='ms-info-container'>
              {selectedAsset ? (
                  <>
                      <div className="volver-arriba-wrapper">
                        <Button 
                          label="Volver arriba" 
                          variant="secondary" 
                          isFilter={false} 
                          onClick={scrollToTop} 
                          isDisabled={false}
                        />
                      </div>
                      <div className='ms-info-container__header'>
                          <div className='ms-info-container__header__parameters'>
                              <h4>Visualizando: {assetName}</h4>
                              <div className='ms-info-container__parameters__dd'>
                                  <DropdownMenu
                                      label="Seleccione un intervalo"
                                      options={intervalList}
                                      selected={selectedInterval}
                                      onSelect={(value) => setSelectedInterval(value)}
                                  />
                                  {selectedType === 'Divisas' &&
                                      <DropdownMenu
                                          label="Seleccione una categoría"
                                          options={exchangeCategory}
                                          onSelect={(value) => {
                                              setSelectedExchangeCategory(value)
                                              let assetTickets = selectedAsset[value].exchange_names
                                              setExchange(assetTickets)
                                          }}
                                      />
                                  }
                                  {(selectedType === 'Acciones' || selectedExchangeCategory) && exchange.length > 0 &&
                                      <DropdownMenu
                                          label = {selectedExchangeCategory ? "Seleccione una divisa" : "Seleccione un mercado"}
                                          options={exchange}
                                          onSelect={(value) => {
                                              setSelectedExchange(value)
                                              if (selectedType === 'Acciones') {
                                                  let index = selectedAsset.exchanges.indexOf(value)
                                                  setSelectedSymbol(selectedAsset.symbols[index])
                                              } else {
                                                  let index = selectedAsset[selectedExchangeCategory].exchange_names.indexOf(value)
                                                  let symbol = selectedAsset[selectedExchangeCategory].exchange_symbols[index]
                                                  setSelectedSymbol(symbol)
                                              }
                                          }}
                                      />
                                  }
                              </div>
                              <div className='ms-info-container__parameters__dp'>
                                  <DatepickerMS
                                      label="Desde:"
                                      value={startDate}
                                      onChange={(newDate) => setStartDate(newDate)}
                                  />
                                  <DatepickerMS
                                      label="Hasta:"
                                      value={endDate}
                                      onChange={(newDate) => setEndDate(newDate)}
                                  />
                              </div>
                          </div>
                          
                          <Button 
                              label="Actualizar" 
                              isDisabled = {disableUpdateButton()} 
                              isFilter={false} 
                              variant="primary" 
                              onClick={formatAndRequest}
                          />
                      </div>
                      <div className='ms-info-container__chart'>
                          {datetimeList.length !== 0 ? (
                              <TimeSeriesChart
                                  labels={datetimeList}
                                  high={highData.map((element) => Number(element))}
                                  low={lowData.map((element) => Number(element))}
                                  open={openData.map((element) => Number(element))}
                                  close={closedData.map((element) => Number(element))}
                              />
                          ) : (
                              <h5>Seleccione los parámetros de búsqueda y actualice la vista</h5>
                          )}
                      </div>
                  </>
              ) : (
                  <h3>Seleccione un activo para visualizarlo</h3>
              )}
            </main>
          </div>
        </div>
    </>
    );

};

export default MarketStats;
