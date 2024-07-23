import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import AmericaDateTime from './Date';


const cleanPriceString = (priceString) => {
  // Используем регулярное выражение для извлечения числового значения
  const match = priceString.match(/\$([\d.]+)/);
  return match ? match[1] : 'Unknown';
};



const cleanAddress = (addressString) => {
  // Используем регулярное выражение для извлечения города
  if(addressString){
    const match = addressString.match(/,\s([A-Za-z\s]+, [A-Z]{2}) \d{5}/);
    return match ? match[1] : 'Unknown';
  } else{
    return 'Unknown'
  }
};




function App() {
  const [monitoringText, setMonitoringText] = useState('Paste text')



  const [inputText, setInputText] = useState('');
  const [formattedText, setFormattedText] = useState('Paste text');
  const [selectedTime, setSelectedTime] = useState('day');
  const [selectedType, setSelectedType] = useState('type 1');


  const [includeMap, setIncludeMap] = useState(false);
  const [includeExit, setIncludeExit] = useState(false);



  const regexPatterns = {
    address: /\d{1,5} [A-Za-z0-9 .,'-]+, [A-Za-z .'-]+, [A-Z]{2} \d{5}/,
    station: /(Pilot|Flying J).*#(\d+)/,
    retailPrice: /RETAIL PRICE\s+\$(\d+\.\d+)/,
    rtsPrice: /RTS PRICE\s+\$(\d+\.\d+)/,
    distance: /(\d+ Miles Away)/,
    exit: /I-\d+(?:[\/&][A-Z\d ]+)?(?:[\/&][A-Z\d ]+)?(?:[\/&][A-Z\d ]+)?(?:[\/&][A-Z\d ]+)?, Exit \d+/,
    
    cityState: /,\s([A-Za-z\s]+, [A-Z]{2}) \d{5}/,
  };



  const extractData = (text, regex) => {
    const match = text.match(regex);
    return match ? match[0] : 'Unknown';
  };




  const formatAddress = (address) => encodeURIComponent(address).replace(/%2C/g, ',').replace(/%20/g, '+');





  const generateFormattedText = (data, addressUrl) => {
    const baseText = `${includeMap ? addressUrl + '\n\n' : ''}${data.station}\n\n\`\`\`${data.address}\`\`\`\n\nPrice: $${data.retailPrice} ($${data.rtsPrice} With Fuel Card)\n\n${data.distance}`;
  
    const exitText = includeExit ? `\n\n${data.exit}` : '';
  
    switch (selectedType) {
      case 'type 2':
        return `${baseText}${exitText}\n\nGood ${selectedTime},\nPlease note to refuel at this station sir!`;
      case 'type 3':
        return `${baseText}${exitText}`;
      default:
        return `${baseText}${exitText}\n\nGood ${selectedTime} sir, how are you today?\nCan you fill up in this station, please!`;
    }
  };
  const generateFormattedMonitoringText = (data) => {
    const baseText = `${data.station}\n${data.address}\nDi: $${data.retailPrice} ($${data.rtsPrice})`;

  
    return baseText;
 
  };


  

  const formatStationInfo = (text) => {
    const data = {
      address: extractData(text, regexPatterns.address).toUpperCase(),
      station: (() => {
        const match = text.match(regexPatterns.station);
        return match ? `${match[1]} #${match[2]}` : 'Unknown Station';
      })(),



      retailPrice: cleanPriceString(extractData(text, regexPatterns.retailPrice)),
      rtsPrice: cleanPriceString(extractData(text, regexPatterns.rtsPrice)),

      distance: extractData(text, regexPatterns.distance),
      exit: extractData(text, regexPatterns.exit),
    };

    const addressUrl = `https://maps.google.com/?q=${formatAddress(data.address)}`;
    return generateFormattedText(data, addressUrl);
  };


  const formatMonitoringInfo = (text) => {
    const data = {
      address: cleanAddress(extractData(text, regexPatterns.address)),
      station: (() => {
        const match = text.match(regexPatterns.station);
        return match ? `${match[1]} #${match[2]}` : 'Unknown Station';
      })(),



      retailPrice: cleanPriceString(extractData(text, regexPatterns.retailPrice)),
      rtsPrice: cleanPriceString(extractData(text, regexPatterns.rtsPrice)),
    };
    return generateFormattedMonitoringText(data);
  };





  const handleFormat = () => {
    const result = formatStationInfo(inputText);
    setFormattedText(result);
    
    const resultTwo = formatMonitoringInfo(inputText);
    setMonitoringText(resultTwo);
  };




  const handleCopy = () => {
    navigator.clipboard.writeText(formattedText).then(() => {
      toast.success('Copied!', { position: 'top-right', autoClose: 3000 });
    }, () => {
      toast.error('Failed to copy text', { position: 'top-right', autoClose: 3000 });
    });
  };

  return (
    <>
      <aside>
        <div className="card">
          <h3>Description settings</h3>
          <div className="descr-type">
            <div className="first">
               <label>
                <input
                  type="radio"
                  name="time"
                  value="day"
                  checked={selectedTime === 'day'}
                  onChange={() => setSelectedTime('day')}
                />
                Day
              </label>
              <label>
                <input
                  type="radio"
                  name="time"
                  value="morning"
                  checked={selectedTime === 'morning'}
                  onChange={() => setSelectedTime('morning')}
                />
                Morning
              </label>
              <label>
                <input
                  type="radio"
                  name="time"
                  value="afternoon"
                  checked={selectedTime === 'afternoon'}
                  onChange={() => setSelectedTime('afternoon')}
                />
                Afternoon
              </label>
              <label>
                <input
                  type="radio"
                  name="time"
                  value="night"
                  checked={selectedTime === 'night'}
                  onChange={() => setSelectedTime('night')}
                />
                Night
              </label>
            </div>
            <div className="first">

            <label>
                <input
                  type="radio"
                  name="type"
                  value="type 1"
                  checked={selectedType === 'type 1'}
                  onChange={() => setSelectedType('type 1')}
                />
                Type 1
              </label>
              <label>
                <input
                  type="radio"
                  name="type"
                  value="morning"
                  checked={selectedType === 'type 2'}
                  onChange={() => setSelectedType('type 2')}
                />
                Type 2
              </label>
              <label>
                <input
                  type="radio"
                  name="type"
                  value="afternoon"
                  checked={selectedType === 'type 3'}
                  onChange={() => setSelectedType('type 3')}
                />
                Type 3
              </label>
            </div>
          </div>
          <div className="first mt-10">

            <label>
              <input 
                type="checkbox" 
                name="map" 
                checked={includeMap} 
                onChange={() => setIncludeMap(!includeMap)}
              />
              Add a google map
            </label>
              <label>
                <input 
                  type="checkbox" 
                  name="exit" 
                  checked={includeExit} 
                  onChange={() => setIncludeExit(!includeExit)}
                />
                Add exit
              </label>
          </div>
        </div>
      </aside>
      <main>

        <AmericaDateTime />
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text here"
          rows={13}
          cols={60}
        ></textarea>
        <button onClick={handleFormat}>Format Text</button>
        <pre className='draggable '>{formattedText}</pre>

        {formattedText && <button onClick={handleCopy}>Copy to Clipboard</button>}
        <ToastContainer />
      </main>
      <aside>



        <pre className='draggable two'>{monitoringText}</pre>


        {monitoringText && <button className='two' onClick={()=>{
          navigator.clipboard.writeText(monitoringText).then(() => {
            toast.success('Copied!', { position: 'top-right', autoClose: 3000 });
          }, () => {
            toast.error('Failed to copy text', { position: 'top-right', autoClose: 3000 });
          });
        }}>Copy to Clipboard</button>}

      </aside>
    </>
  );
}

export default App;
