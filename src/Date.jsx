import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';

const AmericaDateTime = () => {
  const [dateTime, setDateTime] = useState({
    date: moment().tz('America/New_York').format('YYYY-MM-DD'),
    time: moment().tz('America/New_York').format('HH:mm:ss')
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime({
        date: moment().tz('America/New_York').format('YYYY-MM-DD'),
        time: moment().tz('America/New_York').format('HH:mm:ss')
      });
    }, 1000); // Обновление каждые 60000 миллисекунд (1 минута)

    return () => clearInterval(intervalId); // Очистка интервала при размонтировании компонента
  }, []);


  return (
    <header>
       <h1>{dateTime.date} </h1>
      <h2>{dateTime.time} </h2>
    </header>
  );
};

export default AmericaDateTime;
