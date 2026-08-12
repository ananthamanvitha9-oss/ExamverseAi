import React, { useState, memo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import api from '../services/api';
import styles from './CurrentAffairsMap.module.css';

// Low resolution map topojson
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const MapChart = ({ setTooltipContent, onCountryClick }) => {
    return (
        <ComposableMap data-tip="" projectionConfig={{ scale: 140 }}>
            <ZoomableGroup center={[0, 0]} zoom={1}>
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                onMouseEnter={() => {
                                    setTooltipContent(geo.properties.name);
                                }}
                                onMouseLeave={() => {
                                    setTooltipContent("");
                                }}
                                onClick={() => {
                                    onCountryClick(geo.properties.name);
                                }}
                                style={{
                                    default: {
                                        fill: "#e5e7eb",
                                        outline: "none"
                                    },
                                    hover: {
                                        fill: "#3b82f6",
                                        outline: "none",
                                        cursor: "pointer"
                                    },
                                    pressed: {
                                        fill: "#1d4ed8",
                                        outline: "none"
                                    }
                                }}
                            />
                        ))
                    }
                </Geographies>
            </ZoomableGroup>
        </ComposableMap>
    );
};
const MemoizedMap = memo(MapChart);

const CurrentAffairsMap = () => {
    const [tooltipContent, setTooltipContent] = useState("");
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [news, setNews] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleCountryClick = async (countryName) => {
        setSelectedCountry(countryName);
        setIsLoading(true);
        setNews("");

        try {
            const token = localStorage.getItem('token');
            const response = await api.post('/ai/chat', {
                message: `Give me a 3-bullet point summary of the most important current affairs and geopolitical news related to ${countryName} right now. Keep it extremely concise and relevant for UPSC students.`
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNews(response.data.reply);
        } catch (error) {
            console.error(error);
            setNews("Failed to fetch current affairs for this region.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>🗺️ Geopolitics & Current Affairs</h2>
                    <p>Click on any country to get instant AI-curated news for UPSC/SSC.</p>
                </div>

                <div className={styles.contentLayout}>
                    <div className={styles.mapContainer}>
                        <MemoizedMap setTooltipContent={setTooltipContent} onCountryClick={handleCountryClick} />
                        {tooltipContent && (
                            <div className={styles.tooltip}>{tooltipContent}</div>
                        )}
                    </div>

                    <div className={styles.infoPanel}>
                        {selectedCountry ? (
                            <>
                                <h3 className={styles.countryName}>{selectedCountry}</h3>
                                {isLoading ? (
                                    <div className={styles.loadingState}>
                                        <div className={styles.spinner}></div>
                                        <p>Analyzing recent geopolitics...</p>
                                    </div>
                                ) : (
                                    <div className={styles.newsContent}>
                                        {/* Simple formatting for the bullet points */}
                                        {news.split('\n').map((line, idx) => (
                                            <p key={idx}>{line.replace(/[*#]/g, '')}</p>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className={styles.emptyState}>
                                <h3>Select a Country</h3>
                                <p>Interactive map designed for active learning.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CurrentAffairsMap;
