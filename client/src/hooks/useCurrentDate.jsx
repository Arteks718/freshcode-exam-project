import { useState, useEffect } from 'react'

const useCurrentDate = (interval = 1000) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return currentDate.getTime();
}

export default useCurrentDate