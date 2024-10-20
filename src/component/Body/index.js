import React, { useState, useEffect } from 'react';
import { Flex, Input, Form, Button } from 'antd';
import './style.css';

const cities = [
    'Moscow', 'New York', 'London', 'Tokyo', 'Berlin',
    'Paris', 'Beijing', 'Sydney', 'Rio de Janeiro',
    'Cape Town', 'Cairo', 'Toronto', 'Mexico City',
    'Mumbai', 'Sao Paulo', 'Los Angeles', 'Istanbul',
    'Rome', 'Bangkok', 'Seoul'
];

const API_KEY = "fd48bdf8a8b87b3c140f17625f4e2d57";
const API_URL = "https://api.openweathermap.org/data/2.5/weather?q=";

const WeatherGame = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [guess, setGuess] = useState('');
    const [results, setResults] = useState([]);
    const [attempts, setAttempts] = useState(0);
    const [gameStatus, setGameStatus] = useState('');
    const [usedCities, setUsedCities] = useState([]);

    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        setResults([]);
        setAttempts(0);
        setGameStatus('');
        setUsedCities([]);
        getRandomCityWeather();
    };

    const getRandomCityWeather = () => {

        let randomCity;
        do {
            randomCity = cities[Math.floor(Math.random() * cities.length)];
        } while (usedCities.includes(randomCity));

        setUsedCities(prev => [...prev, randomCity]);
        fetchWeather(randomCity);
    };

    const fetchWeather = (city) => {
        fetch(`${API_URL}${city}&appid=${API_KEY}&units=metric`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setWeatherData({
                    temperature: data.main.temp,
                    city: data.name,
                    country: data.sys.country,
                });
            });
    };

    const handleGuess = () => {
        if (weatherData && guess) {
            const guessedTemperature = parseFloat(guess);
            const actualTemperature = weatherData.temperature;

            const isCorrect = Math.abs(actualTemperature - guessedTemperature) <= 4;
            setResults(prev => [...prev, {
                city: weatherData.city,
                country: weatherData.country,
                guess: guessedTemperature,
                actual: actualTemperature,
                correct: isCorrect
            }]);

            setAttempts(prev => prev + 1);
            setGuess('');

            if (attempts + 1 === 5) {
                const correctCount = results.filter(result => result.correct).length + (isCorrect ? 1 : 0);
                setGameStatus(correctCount >= 4 ? 'You win!' : 'You lose!');
            } else {
                getRandomCityWeather();
            }
        }
    };

    return (
        <Flex className='weather_body'>
            <h1>Weather Game</h1>
            {weatherData && (
                <div>
                    <h2>{weatherData.city}, {weatherData.country}</h2>
                    <img
                        src={`https://flagpedia.net/data/flags/h80/${weatherData.country.toLowerCase()}.png`}
                        alt="Country flag"
                    />
                    <Form onFinish={handleGuess} align='center' className='input_values'>
                        <Input
                            value={guess}
                            onChange={(e) => setGuess(e.target.value)}
                            placeholder="Enter your temperature guess"
                        />
                        <Button type="primary" htmlType="submit">Submit Guess</Button>
                    </Form>
                    <div className="results-container">
                        {results.map((result, index) => (
                            <div
                                key={index}
                                className={`result-box ${result.correct ? 'correct' : 'incorrect'}`}
                            >
                                <p>{result.country}: {result.guess}°C (Actual: {result.actual}°C)</p>
                            </div>
                        ))}
                    </div>
                    {gameStatus && <h2>{gameStatus}</h2>}
                    <Button onClick={startNewGame}>Restart Game</Button>
                </div>
            )}
        </Flex>
    );
};

export default WeatherGame;
