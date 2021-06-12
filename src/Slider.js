import { useState } from 'react';
import './assets/css/index.scss';

export default function Slider() {
  const MIN_AMOUNT = 10000;
  const MAX_AMOUNT= 30000;
  const DEFAULT_AMOUNT = 26000;
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);

  const toCurrency = val => {
    let formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    });

    return formatter.format(val);
  }

  const handleCustom = e => {
    let re = /^[0-9\b]+$/;
    let val = e.target.value.replace('$', '').replace(',', '');

    // if value is not blank, then test the regex
    if (val === '' || re.test(val)) {
      document.getElementById("amount").value = toCurrency(val);
      document.getElementById("slider").value = val;
      setAmount(val);
    }
  }

  const handleRange = () => {
    let val = document.getElementById("slider").value;
    
    document.getElementById("amount").value = val;
    setAmount(val);
  }

  return (
    <div className="container">
      <div className="slider-container">
        <input 
          id='amount'
          value={toCurrency(amount)}
          onChange={e => handleCustom(e)}
        />

        <input 
          id='slider'
          type='range'
          min='10000'
          max='30000'
          defaultValue={amount}
          onChange={handleRange}
        ></input>

        <div className="label-container">
          <p>{toCurrency(MIN_AMOUNT)}</p>
          <p>{toCurrency(MAX_AMOUNT)}</p>
        </div>
      </div>
    </div>
  );
}